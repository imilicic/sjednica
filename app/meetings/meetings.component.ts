import { Component, OnInit } from '@angular/core';

import { MeetingService } from './shared/services/meeting.service';
import { Meeting } from '../shared/models/meeting.model';
import { ToastrService } from '../shared/services/toastr.service';

@Component({
    templateUrl: './meetings.component.html'
})
export class MeetingsComponent implements OnInit {
    meetings: Meeting[];

    constructor(
        private meetingService: MeetingService,
        private toastrService: ToastrService
    ) {}

    ngOnInit() {
        this.meetingService.getMeetings()
        .subscribe((meetings: Meeting[]) => {
            this.meetings = meetings;
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }
}
