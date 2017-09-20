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
    private absentUsers: any[];
    private absentUsersDb: any[];
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
        this.absentUsersDb = [];
        this.meeting = this.activatedRoute.snapshot.data['meeting'];
        this.reasonForm = new FormGroup({});
        this.reasons = [];
        this.users = [];
        let responseCame = false;

        this.meetingService.retrieveCouncilMembers()
        .subscribe((users: User[]) => {
            this.users = users;
        });

        this.meetingService.retrieveAbsence(this.meeting.MeetingId)
        .subscribe((response: any[]) => {
            this.absentUsersDb = response;

            this.meetingService.retrievePresence(this.meeting.MeetingId)
            .subscribe((response2: any[]) => {
                let i = 0;

                this.users.forEach((user: any) => {
                    if (!response2.find(presence => presence.UserId === user.UserId)) {
                        this.absentUsers.push(user);
                        let foundAbsentUser = this.absentUsersDb.find(absentUser => absentUser.CouncilMemberId === user.CouncilMemberId);

                        if (foundAbsentUser) {
                            this.reasons.push(new FormControl(foundAbsentUser.Reason, Validators.required));
                        } else {
                            this.reasons.push(new FormControl('', Validators.required));
                        }

                        this.reasonForm.addControl('reason' + i, this.reasons[i]);
                        i++;
                    }
                });

                if (this.absentUsers.length === 0) {
                    this.router.navigate(['meetings', this.meeting.MeetingId]);
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

            if (this.absentUsersDb.find(absentUser => absentUser.CouncilMemberId === user.CouncilMemberId)) {
                this.meetingService.replaceAbsence(this.meeting.MeetingId, user.CouncilMemberId, reason)
                .subscribe((response: any) => {
                    done[i] = true;

                    if (done.every(el => el)) {
                        this.toastrService.success('Spremljeno!');
                        this.router.navigate(['meetings', this.meeting.MeetingId]);
                    }
                }, (error: string) => {
                    this.toastrService.error(error);
                });
            } else {
                this.meetingService.createAbsenceAdmin(this.meeting.MeetingId, user.CouncilMemberId, reason)
                .subscribe((response: any) => {
                    done[i] = true;

                    if (done.every(el => el)) {
                        this.toastrService.success('Spremljeno!');
                        this.router.navigate(['meetings', this.meeting.MeetingId]);
                    }
                }, (error: string) => {
                    this.toastrService.error(error);
                });
            }
        });
    }
}
