import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MeetingService } from '../shared/services/meeting.service';
import { Meeting } from '../../shared/models/meeting.model';
import { ToastrService } from '../../shared/services/toastr.service';
import { TypeService } from '../../shared/services/type.service';

@Component({
    templateUrl: './meeting-create.component.html'
})

export class MeetingCreateComponent implements OnInit {
    private address: FormControl;
    private city: FormControl;
    private day: FormControl;
    private hours: FormControl;
    private meetingForm: FormGroup;
    private minutes: FormControl;
    private month: FormControl;
    private months: string[];
    private typeId: FormControl;
    private year: FormControl;

    constructor(
        private meetingService: MeetingService,
        private router: Router,
        private toastrService: ToastrService,
        private typeService: TypeService
    ) { }

    ngOnInit() {
        this.months = [
            'siječanj', 'veljača', 'ožujak', 'travanj',
            'svibanj', 'lipanj', 'srpanj', 'kolovoz',
            'rujan', 'listopad', 'studeni', 'prosinac'
        ];

        this.buildForm();
    }

    private buildForm() {
        this.address = new FormControl('', Validators.required);
        this.city = new FormControl('', Validators.required);
        this.typeId = new FormControl(2, Validators.required);

        let now = new Date();
        this.day = new FormControl(now.getDate() + 1, Validators.required);
        this.month = new FormControl(now.getMonth() + 1, Validators.required);
        this.year = new FormControl(now.getFullYear(), [Validators.required, Validators.min(1900), Validators.max(9999)]);
        this.hours = new FormControl(now.getHours() + 2, Validators.required);
        this.minutes = new FormControl(0, Validators.required);

        this.meetingForm = new FormGroup({
            address: this.address,
            city: this.city,
            day: this.day,
            hours: this.hours,
            minutes: this.minutes,
            month: this.month,
            typeId: this.typeId,
            year: this.year
        });
    }

    private createMeeting() {
        let date = new Date(this.year.value, this.month.value - 1, this.day.value, this.hours.value, this.minutes.value);

        let newMeeting: Meeting = {
            MeetingId: undefined,
            Address: this.address.value,
            AgendaItems: undefined,
            City: this.city.value,
            DateTime: date,
            Number: null,
            NumberInYear: null,
            TypeId: this.typeId.value
        };

        this.meetingService.createMeeting(newMeeting)
        .subscribe((meeting: Meeting) => {
            this.toastrService.success('Sjednica je izrađena!');
            this.router.navigate(['meetings/', meeting.MeetingId]);
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }

    private range(n: number): number[] {
        let result = [];

        for (let i = 1; i <= n; i++) {
            result.push(i);
        }

        return result;
    }
}
