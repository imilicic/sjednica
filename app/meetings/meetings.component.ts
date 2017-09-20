import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../shared/services/authentication.service';
import { MeetingService } from './shared/services/meeting.service';
import { Meeting } from '../shared/models/meeting.model';
import { ToastrService } from '../shared/services/toastr.service';
import { TypeService } from '../shared/services/type.service';

@Component({
    templateUrl: './meetings.component.html'
})
export class MeetingsComponent implements OnInit {
    private presenceAdded: any[];
    private meetings: Meeting[];

    constructor(
        private authenticationService: AuthenticationService,
        private meetingService: MeetingService,
        private toastrService: ToastrService,
        private typeService: TypeService
    ) {}

    ngOnInit() {
        this.presenceAdded = [];

        this.meetingService.getMeetings()
        .subscribe((meetings: Meeting[]) => {
            this.meetings = meetings;

            if (this.authenticationService.isAdmin()) {
                this.meetings.forEach(meeting => {
                    if (this.isToday(meeting.DateTime) && this.isPassed(meeting.DateTime)) {
                        this.presenceAdded.push({
                            meetingId: meeting.MeetingId,
                            presenceAdded: undefined
                        });

                        this.meetingService.retrievePresenceCount(meeting.MeetingId)
                        .subscribe((response: any) => {
                            let presence = this.presenceAdded.find(el => el.meetingId === meeting.MeetingId);

                            if (response.Number > 0) {
                                presence.presenceAdded = true;
                            } else {
                                presence.presenceAdded = false;
                            }
                        });
                    }
                });
            }
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }

    private ifPresenceAdded(meetingId: number) {
        let presence = this.presenceAdded.find(el => el.meetingId === meetingId);

        if (presence === undefined) {
            return false;
        } else {
            return presence.presenceAdded;
        }
    }

    private isPassed(dateTime: Date) {
        let date = new Date(dateTime);
        let now = new Date();

        return date < now;
    }

    private isToday(dateTime: Date) {
        let date = new Date(dateTime);
        let now = new Date();

        return date.getDate() === now.getDate() &&
        date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
    }
}
