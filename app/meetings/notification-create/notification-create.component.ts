import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationService } from '../shared/services/notification.service';
import { ToastrService } from '../../shared/services/toastr.service';

@Component({
    templateUrl: './notification-create.component.html'
})

export class NotificationCreateComponent implements OnInit {
    private meetingId: number;
    private notificationForm: FormGroup;
    private text: FormControl;

    constructor(
        private activatedRoute: ActivatedRoute,
        private notificationService: NotificationService,
        private router: Router,
        private toastrService: ToastrService
    ) { }

    ngOnInit() {
        this.meetingId = this.activatedRoute.snapshot.params['meetingId'];
        this.buildForm();
    }

    private buildForm() {
        this.text = new FormControl('', Validators.required);

        this.notificationForm = new FormGroup({
            text: this.text
        });
    }

    private createNotification() {
        let newNotification: any = {
            NotificationId: undefined,
            Text: this.text.value
        }

        this.notificationService.createNotification(this.meetingId, newNotification)
        .subscribe((response: any) => {
            this.toastrService.success('Obavijest je dodana!');
            this.router.navigate(['meetings', this.meetingId]);
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }
}
