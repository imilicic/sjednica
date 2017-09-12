import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Meeting } from '../../shared/models/meeting.model';
import { MeetingService } from '../shared/services/meeting.service';
import { ToastrService } from '../../shared/services/toastr.service';
import { User } from '../../shared/models/user.model';

@Component({
    templateUrl: './meeting-absence.component.html'
})

export class MeetingAbsenceComponent implements OnInit {
    private absentUsers: User[];
    private meeting: Meeting;
    private reasonForm: FormGroup;
    private reasons: FormControl[];
    private users: User[];

    constructor(
        private activatedRoute: ActivatedRoute,
        private meetingService: MeetingService,
        private router: Router,
        private toastrService: ToastrService
    ) { }

    ngOnInit() {
        this.absentUsers = [];
        this.meeting = this.activatedRoute.snapshot.data['meeting'];
        this.reasonForm = new FormGroup({});
        this.reasons = [];
        this.users = [];

        this.meetingService.retrieveCouncilMembers()
        .subscribe((users: User[]) => {
            this.users = users;
        });

        this.meetingService.retrievePresence(this.meeting.MeetingId)
        .subscribe((response: any[]) => {
            let i = 0;

            this.users.forEach((user: User) => {
                if (!response.find(presence => presence.UserId === user.UserId)) {
                    this.absentUsers.push(user);
                    this.reasons.push(new FormControl('', Validators.required));
                    this.reasonForm.addControl('reason' + i, this.reasons[i]);
                    i++;
                }
            });
        });

    }

    private createAbsence() {
        let done: boolean[] = [];

        this.absentUsers.forEach((user, i) => {
            let reason: any = {
                Reason: this.reasons[i].value
            };
            done.push(false);

            this.meetingService.createAbsenceAdmin(this.meeting.MeetingId, user.CouncilMemberships[0].CouncilMembershipId, reason)
            .subscribe((response: any) => {
                done[i] = true;

                if (done.every(el => el)) {
                    this.toastrService.success('Spremljeno!');
                    this.router.navigate(['meetings', this.meeting.MeetingId]);
                }
            }, (error: string) => {
                this.toastrService.error(error);
            });
        });
    }
}
