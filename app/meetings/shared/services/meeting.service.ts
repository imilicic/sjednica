import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Meeting } from '../../../shared/models/meeting.model';

@Injectable()
export class MeetingService {
    constructor(
        private authHttp: AuthHttp
    ) { }

    getMeeting(meetingId: number): Observable<Meeting> {
        return this.authHttp.get('/api/meetings/' + meetingId)
        .map((response: Response) => <Meeting>response.json())
        .catch(this.handleError);
    }

    getMeetings(): Observable<Meeting[]> {
        return this.authHttp.get('/api/meetings/')
        .map((response: Response) => <Meeting[]>response.json().meetings)
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.text());
    }
}
