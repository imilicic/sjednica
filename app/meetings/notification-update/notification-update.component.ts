import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationService } from '../shared/services/notification.service';
import { ToastrService } from '../../shared/services/toastr.service';

@Component({
    templateUrl: './notification-update.component.html'
})

export class NotificationUpdateComponent implements OnInit {
    private meetingId: number;
    private notifications: any[];
    private notificationForms: FormGroup[];
    private text: FormControl[];

    constructor(
        private activatedRoute: ActivatedRoute,
        private notificationService: NotificationService,
        private router: Router,
        private toastrService: ToastrService
    ) { }

    ngOnInit() {
        this.meetingId = this.activatedRoute.snapshot.params['meetingId'];
        this.notifications = this.activatedRoute.snapshot.data['notifications'];

        // if (this.isToday() || this.isPassed()) {
        //     this.router.navigate(['meetings', this.meetingId]);
        //     return;
        // }

        this.buildForm();
    }

    private buildForm() {
        this.notificationForms = [];
        this.text = [];

        this.notifications.forEach((notification: any, i) => {
            this.text.push(new FormControl(notification.Text, Validators.required));

            this.notificationForms.push(new FormGroup({
                text: this.text[i]
            }));
        });
    }

    // private isPassed() {
    //     let date = new Date(this.meeting.DateTime);
    //     let now = new Date();

    //     return now >= date;
    // }

    // private isToday() {
    //     let date = new Date(this.meeting.DateTime);
    //     let now = new Date();

    //     return date.getDate() === now.getDate() &&  date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    // }

    private updateNotification(i: number) {
        let newNotification: any = {
            NotificationId: undefined,
            Text: this.text[i].value
        };

        this.notificationService.replaceNotification(this.meetingId, this.notifications[i].NotificationId, newNotification)
        .subscribe((notification: any) => {
            this.toastrService.success('Spremljeno!');
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }
}
