import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CouncilMember } from '../../shared/models/council-member.model';
import { CouncilMemberService } from '../shared/services/council-member.service';
import { dateValidator } from '../shared/validators';
import { ResponseMessagesService } from '../../shared/services/response-messages.service';
import { ToastrService } from '../../shared/services/toastr.service';

@Component({
    templateUrl: './council-member-update.component.html',
    styles: [`
        .error {
            float: right;
            margin: 0px;
        }
    `]
})

export class CouncilMemberUpdateComponent implements OnInit {
    private councilMember: CouncilMember;
    private councilMemberForm: FormGroup;
    private endDay: FormControl;
    private endMonth: FormControl;
    private endYear: FormControl;
    private months: string[];
    private permanentMember: FormControl;
    private startDay: FormControl;
    private startMonth: FormControl;
    private startYear: FormControl;

    constructor(
        private activatedRoute: ActivatedRoute,
        private councilMemberService: CouncilMemberService,
        private responseMessagesService: ResponseMessagesService,
        private router: Router,
        private toastrService: ToastrService
    ) { }

    ngOnInit() {
        this.councilMember = this.activatedRoute.snapshot.data['councilMember'];
        this.months = [
            'siječanj', 'veljača', 'ožujak', 'travanj',
            'svibanj', 'lipanj', 'srpanj', 'kolovoz',
            'rujan', 'listopad', 'studeni', 'prosinac'
        ];

        this.buildForm();
    }

    private buildForm() {
        if (this.councilMember.EndDate === '9999-12-31') {
            this.permanentMember = new FormControl(true, Validators.required);
        } else {
            this.permanentMember = new FormControl(false, Validators.required);
        }

        let startDate = this.parseDateString(this.councilMember.StartDate);
        this.startDay = new FormControl(startDate[2], Validators.required);
        this.startMonth = new FormControl(startDate[1], Validators.required);
        this.startYear = new FormControl(startDate[0], [Validators.required, Validators.min(1900), Validators.max(9999)]);

        let endDate = this.parseDateString(this.councilMember.EndDate);
        this.endDay = new FormControl(endDate[2], Validators.required);
        this.endMonth = new FormControl(endDate[1], Validators.required);
        this.endYear = new FormControl(endDate[0], [Validators.required, Validators.min(1900), Validators.max(9999)]);

        this.councilMemberForm = new FormGroup({
            endDay: this.endDay,
            endMonth: this.endMonth,
            endYear: this.endYear,
            permanentMember: this.permanentMember,
            startDay: this.startDay,
            startMonth: this.startMonth,
            startYear: this.startYear
        });

        this.councilMemberForm.setValidators([dateValidator(true)]);
    }

    private generateDateString(year: number, month: number, day: number): string {
        let monthString = '';
        let dayString = '';

        if (month < 10) {
            monthString = '0';
        }

        monthString +=  month.toString();

        if (day < 10) {
            dayString = '0';
        }

        dayString +=  day.toString();

        return year.toString() + '-' + monthString + '-' + dayString;
    }

    private getWarningMessage(code: string) {
        return this.responseMessagesService.getMessage({
            location: 'users/create',
            code: code
        });
    }

    private parseDateString(date: string): number[] {
        let dateArray = date.split('-');

        return dateArray.map((value: string) => parseInt(value, 10));
    }

    private range(n: number): number[] {
        let result = [];

        for (let i = 1; i <= n; i++) {
            result.push(i);
        }

        return result;
    }

    private togglePermanentMember() {
        if (this.permanentMember.value) {
            this.endDay.setValue(31);
            this.endMonth.setValue(12);
            this.endYear.setValue(9999);
        } else {
            let next = new Date(this.startYear.value + 1, this.startMonth.value - 1, this.startDay.value);

            this.endDay.setValue(next.getDate());
            this.endMonth.setValue(next.getMonth() + 1);
            this.endYear.setValue(next.getFullYear());
        }
    }

    private updateCouncilMember() {
        let startDate = this.generateDateString(this.startYear.value, this.startMonth.value, this.startDay.value);
        let endDate = this.generateDateString(this.endYear.value, this.endMonth.value, this.endDay.value);
        let newCouncilMember: any = {
            StartDate: startDate,
            EndDate: endDate,
            UserId: 99
        };

        this.councilMemberService.replaceCouncilMember(this.councilMember.CouncilMemberId, newCouncilMember)
        .subscribe((councilMember: CouncilMember) => {
            this.toastrService.success('Spremljeno!');
            this.router.navigate(['council-members', councilMember.CouncilMemberId]);
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }
}
