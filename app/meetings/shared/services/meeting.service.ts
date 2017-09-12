import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Meeting } from '../../../shared/models/meeting.model';
import { User } from '../../../shared/models/user.model';

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

    createAbsenceAdmin(meetingId: number, councilMemberId: number, reason: any): Observable<any> {
        return this.authHttp.post('/api/meetings/' + meetingId + '/absence/councilMemberId/' + councilMemberId, reason)
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    createPresenceAdmin(meetingId: number, userId: number): Observable<any> {
        return this.authHttp.post('/api/meetings/' + meetingId + '/presence/userId/' + userId, {})
        .map((response: Response) => response.text())
        .catch(this.handleError);
    }

    createPresenceUser(meetingId: number): Observable<any> {
        return this.authHttp.post('/api/meetings/' + meetingId + '/presence', {})
        .map((response: Response) => response.text())
        .catch(this.handleError);
    }

    deletePresence(meetingId: number, userId: number): Observable<any> {
        return this.authHttp.delete('/api/meetings/' + meetingId + '/presence/userId/' + userId)
        .map((response: Response) => response.text())
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

    replaceMeeting(meetingId: number, meeting: Meeting): Observable<Meeting> {
        return this.authHttp.put('/api/meetings/' + meetingId, meeting)
        .map((response: Response) => <Meeting>response.json())
        .catch(this.handleError);
    }

    retrieveAbsenceCount(meetingId: number): Observable<any> {
        return this.authHttp.get('/api/meetings/' + meetingId + '/absence/count')
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    retrieveCouncilMembers(): Observable<User[]> {
        return this.authHttp.get('/api/council-members')
        .map((response: Response) => <User[]>response.json())
        .catch(this.handleError)
    }

    retrievePresence(meetingId: number): Observable<any[]> {
        return this.authHttp.get('/api/meetings/' + meetingId + '/presence')
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    retrievePresenceCount(meetingId: number): Observable<any> {
        return this.authHttp.get('/api/meetings/' + meetingId + '/presence/count')
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    retrieveUsers(): Observable<User[]> {
        return this.authHttp.get('/api/users')
        .map((response: Response) => <User[]>response.json())
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.text());
    }
}
