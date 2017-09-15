import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { NotificationService } from './notification.service';

@Injectable()
export class NotificationResolverService implements Resolve<any> {
    constructor(
        private router: Router,
        private notificationService: NotificationService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        let notifications = this.notificationService.retrieveNotifications(route.params['meetingId']);
        notifications.subscribe((_: any) => {
            return true;
        }, (error: string) => {
            this.router.navigate(['meetings']);
        });

        return notifications;
    }
}
