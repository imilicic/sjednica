import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class NotificationService {
    constructor(
        private authHttp: AuthHttp
    ) { }

    createNotification(meetingId: number, notification: any): Observable<any> {
        return this.authHttp.post('/api/meetings/' + meetingId + '/notifications', notification)
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    retrieveNotifications(meetingId: number): Observable<any[]> {
        return this.authHttp.get('/api/meetings/' + meetingId + '/notifications')
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    retrieveNotification(meetingId: number, notificationId: number): Observable<any> {
        return this.authHttp.get('/api/meetings/' + meetingId + '/notifications/' + notificationId)
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    replaceNotification(meetingId: number, notificationId: number, newNotification: any): Observable<any> {
        return this.authHttp.put('/api/meetings/' + meetingId + '/notifications/' + notificationId, newNotification)
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.text());
    }
}
