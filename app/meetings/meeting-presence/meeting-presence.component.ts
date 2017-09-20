import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Meeting } from '../../shared/models/meeting.model';
import { MeetingService } from '../shared/services/meeting.service';
import { ToastrService } from '../../shared/services/toastr.service';
import { User } from '../../shared/models/user.model';

@Component({
    templateUrl: './meeting-presence.component.html'
})

export class MeetingPresenceComponent implements OnInit {
    private chosenUserControl: FormControl;
    private chosenUsers: User[];
    private chosenUsersForm: FormGroup;
    private createdUsers: any[];
    private meeting: Meeting;
    private minimumNumberOfUsers: number;
    private userControl: FormControl;
    private users: User[];

    constructor(
        private activatedRoute: ActivatedRoute,
        private meetingService: MeetingService,
        private router: Router,
        private toastrService: ToastrService
    ) { }

    ngOnInit() {
        this.chosenUsers = [];
        this.createdUsers = [];
        this.meeting = this.activatedRoute.snapshot.data['meeting'];
        this.users = [];

        this.meetingService.retrieveUsers()
        .subscribe((users: User[]) => {
            this.users = users;

            let totalNumberOfUsers = this.users.length;

            this.minimumNumberOfUsers = Math.floor(totalNumberOfUsers / 2) + 1;

            this.users.forEach((user: User) => {
                this.createdUsers.push({
                    UserId: user.UserId,
                    Created: false
                })
            });
        });

        this.meetingService.retrievePresence(this.meeting.MeetingId)
        .subscribe((response: any[]) => {
            response.forEach((presence: any) => {
                this.createdUsers.find(el => el.UserId === presence.UserId).Created = true;
                this.moveUserById(this.users, this.chosenUsers, presence.UserId);
            })
        });

        this.buildForm();
    }

    private appendAllUsers() {
        while (this.users.length > 0) {
            this.moveUserById(this.users, this.chosenUsers, this.users[0].UserId);
        }
    }

    private appendUsers() {
        this.userControl.value.forEach((userId: number) => {
            this.moveUserById(this.users, this.chosenUsers, userId);
        });
    }

    private buildForm() {
        this.chosenUserControl = new FormControl([]);
        this.userControl = new FormControl([]);

        this.chosenUsersForm = new FormGroup({
            chosenUserControl: this.chosenUserControl,
            userControl: this.userControl
        });
    }

    private createPresence() {
        let done: boolean[] = [];

        this.users.forEach((user: User) => {
            if (this.createdUsers.find(el => el.UserId === user.UserId).Created) {
                this.meetingService.deletePresence(this.meeting.MeetingId, user.UserId)
                .subscribe();
            }
        });

        this.chosenUsers.forEach((user: User, i: number) => {
            done.push(false);
            this.meetingService.createPresenceAdmin(this.meeting.MeetingId, user.UserId)
            .subscribe((response: any) => {
                done[i] = true;
                this.createdUsers.find(el => el.UserId === user.UserId).Created = true;

                if (done.every(el => el)) {
                    this.toastrService.success('Spremljeno!');
                    this.router.navigate(['meetings', this.meeting.MeetingId, 'absence']);
                }
            }, (error: string) => {
                this.toastrService.error(error);
            });
        });
    }

    private deleteAllUsers() {
        while (this.chosenUsers.length > 0) {
            this.moveUserById(this.chosenUsers, this.users, this.chosenUsers[0].UserId);
        }
    }

    private deleteUsers() {
        this.chosenUserControl.value.forEach((userId: number) => {
            this.moveUserById(this.chosenUsers, this.users, userId);
        });
    }

    private isQuorumMet() {
        let currentNumber = this.chosenUsers.length;

        return currentNumber >= this.minimumNumberOfUsers;
    }

    private moveUserById(from: User[], to: User[], userId: number) {
        let foundUser = from.find(user => user.UserId === userId);

        to.push(foundUser);
        from.splice(from.indexOf(foundUser), 1);
    }
}
