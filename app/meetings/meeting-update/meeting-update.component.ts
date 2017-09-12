import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MeetingService } from '../shared/services/meeting.service';
import { Meeting } from '../../shared/models/meeting.model';
import { ToastrService } from '../../shared/services/toastr.service';
import { TypeService } from '../../shared/services/type.service';

@Component({
    templateUrl: './meeting-update.component.html'
})

export class MeetingUpdateComponent implements OnInit {
    private address: FormControl;
    private city: FormControl;
    private day: FormControl;
    private hours: FormControl;
    private meeting: Meeting;
    private meetingForm: FormGroup;
    private minutes: FormControl;
    private month: FormControl;
    private months: string[];
    private numberInYear: FormControl;
    private typeId: FormControl;
    private year: FormControl;

    constructor(
        private activatedRoute: ActivatedRoute,
        private meetingService: MeetingService,
        private router: Router,
        private toastrService: ToastrService,
        private typeService: TypeService
    ) { }

    ngOnInit() {
        this.meeting = this.activatedRoute.snapshot.data['meeting'];

        if (this.isToday() || this.isPassed()) {
            this.router.navigate(['meetings', this.meeting.MeetingId]);
            return;
        }

        this.months = [
            'siječanj', 'veljača', 'ožujak', 'travanj',
            'svibanj', 'lipanj', 'srpanj', 'kolovoz',
            'rujan', 'listopad', 'studeni', 'prosinac'
        ];

        this.buildForm();
    }

    private buildForm() {
        this.address = new FormControl(this.meeting.Address, Validators.required);
        this.city = new FormControl(this.meeting.City, Validators.required);
        this.numberInYear = new FormControl(this.meeting.NumberInYear, [Validators.required, Validators.min(1)]);
        this.typeId = new FormControl(this.meeting.TypeId, Validators.required);

        let date = new Date(this.meeting.DateTime);
        this.day = new FormControl(date.getDate(), Validators.required);
        this.month = new FormControl(date.getMonth() + 1, Validators.required);
        this.year = new FormControl(date.getFullYear(), [Validators.required, Validators.min(1900), Validators.max(9999)]);
        this.hours = new FormControl(date.getHours(), Validators.required);
        this.minutes = new FormControl(date.getMinutes(), Validators.required);

        this.meetingForm = new FormGroup({
            address: this.address,
            city: this.city,
            day: this.day,
            hours: this.hours,
            minutes: this.minutes,
            month: this.month,
            numberInYear: this.numberInYear,
            typeId: this.typeId,
            year: this.year
        });
    }

    private isPassed() {
        let date = new Date(this.meeting.DateTime);
        let now = new Date();

        return now >= date;
    }

    private isToday() {
        let date = new Date(this.meeting.DateTime);
        let now = new Date();

        return date.getDate() === now.getDate() &&  date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    }

    private range(n: number): number[] {
        let result = [];

        for (let i = 1; i <= n; i++) {
            result.push(i);
        }

        return result;
    }

    private updateMeeting() {
        let date = new Date(this.year.value, this.month.value - 1, this.day.value, this.hours.value, this.minutes.value);

        let newMeeting: Meeting = {
            MeetingId: undefined,
            Address: this.address.value,
            AgendaItems: undefined,
            City: this.city.value,
            DateTime: date,
            Number: null,
            NumberInYear: this.numberInYear.value,
            TypeId: this.typeId.value
        };

        this.meetingService.replaceMeeting(this.meeting.MeetingId, newMeeting)
        .subscribe((meeting: Meeting) => {
            this.toastrService.success('Sjednica je spremljena!');
            this.router.navigate(['meetings/', meeting.MeetingId]);
        }, (error: string) => {
            this.toastrService.error(error);
            this.meetingForm.reset();
        });
    }
}
