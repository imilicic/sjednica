import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Meeting } from '../../shared/models/meeting.model';

@Component({
    templateUrl: './meeting.component.html'
})

export class MeetingComponent implements OnInit {
    private meeting: Meeting;

    constructor(
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.activatedRoute.data.subscribe((data: any) => {
            this.meeting = data.meeting;
        });
    }
}
