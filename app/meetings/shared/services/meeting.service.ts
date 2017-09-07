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

    createMeeting(meeting: Meeting): Observable<Meeting> {
        return this.authHttp.post('/api/meetings', meeting)
        .map((response: Response) => <Meeting>response.json())
        .catch(this.handleError);
    }

    getMeeting(meetingId: number): Observable<Meeting> {
        return this.authHttp.get('/api/meetings/' + meetingId)
        .map((response: Response) => <Meeting>response.json())
        .catch(this.handleError);
    }

    getMeetings(): Observable<Meeting[]> {
        return this.authHttp.get('/api/meetings/')
        .map((response: Response) => <Meeting[]>response.json())
        .catch(this.handleError);
    }

    retrieveAbsence(meetingId: number): Observable<any> {
        return this.authHttp.get('/api/meetings/' + meetingId + '/absence')
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    retrievePresence(meetingId: number): Observable<any> {
        return this.authHttp.get('/api/meetings/' + meetingId + '/presence')
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.text());
    }
}
