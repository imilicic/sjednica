import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Meeting } from '../../shared/models/meeting.model';
import { MeetingService } from '../shared/services/meeting.service';

@Injectable()
export class MeetingResolverService implements Resolve<Meeting> {
    constructor(
        private router: Router,
        private meetingService: MeetingService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Meeting> {
        let meeting = this.meetingService.getMeeting(route.params['meetingId']);
        meeting.subscribe((_: Meeting) => {
            return true;
        }, (error: string) => {
            this.router.navigate(['meetings']);
        });

        return meeting;
    }
}
