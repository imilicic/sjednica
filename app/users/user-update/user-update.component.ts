import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Roles } from '../../shared/models/roles.enum';
import { User } from '../../shared/models/user.model';
import { PasswordService } from '../../shared/services/password.service';
import { ResponseMessagesService } from '../../shared/services/response-messages.service';
import { ToastrService } from '../../shared/services/toastr.service';
import { UserService } from '../shared/services/user.service';
import { dateValidator } from '../shared/validators';

@Component({
    styleUrls: ['./user-update.component.css'],
    templateUrl: './user-update.component.html'
})
export class UserUpdateComponent implements OnInit {
    roles = Roles;
    user: User;

    email: FormControl;
    firstName: FormControl;
    isCouncilMember: FormControl;
    lastName: FormControl;
    password: string;
    permanentMember: FormControl;
    phoneNumber: FormControl;
    roleName: FormControl;
    userForm: FormGroup;

    startDay: FormControl;
    startMonth: FormControl;
    startYear: FormControl;

    endDay: FormControl;
    endMonth: FormControl;
    endYear: FormControl;

    months: string[] = [
        'siječanj', 'veljača', 'ožujak', 'travanj',
        'svibanj', 'lipanj', 'srpanj', 'kolovoz',
        'rujan', 'listopad', 'studeni', 'prosinac'
    ];

    changeEndDate() {
        if (this.permanentMember.value) {
            this.endYear.setValue(9999);
            this.endMonth.setValue(12);
            this.endDay.setValue(31);
        } else {
            this.endYear.setValue(this.startYear.value + 1);
            this.endMonth.setValue(this.startMonth.value);
            this.endDay.setValue(this.startDay.value);
        }
    }

    changeUserPassword(action: boolean) {
        if (action) {
            this.password = this.passwordService.generatePassword(8, 4, 2);
        } else {
            this.password = null;
        }
    }

    constructor (
        private activatedRoute: ActivatedRoute,
        private passwordService: PasswordService,
        private responseMessagesService: ResponseMessagesService,
        private router: Router,
        private toastrService: ToastrService,
        private userService: UserService
    ) {}

    getWarningMessage(code: string) {
        return this.responseMessagesService.getMessage({
            location: 'createUser',
            code: code
        });
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((data: any) => {
            this.user = data.user;

            this.buildUserForm();
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }

    range(n: number): number[] {
        let result = [];

        for (let i = 1; i <= n; i++) {
            result.push(i);
        }

        return result;
    }

    setDefaultDates() {
        if (!this.isCouncilMember.value) {
            let startEndDateParse = this.prepareStartEndDates();

            this.startYear.setValue(startEndDateParse.StartDate[0]);
            this.startMonth.setValue(startEndDateParse.StartDate[1]);
            this.startDay.setValue(startEndDateParse.StartDate[2]);

            this.endYear.setValue(startEndDateParse.EndDate[0]);
            this.endMonth.setValue(startEndDateParse.EndDate[1]);
            this.endDay.setValue(startEndDateParse.EndDate[2]);
        }
    }

    updateUser() {
        let endDate;
        let startDate;
        let newUser: User = {
            Email: this.email.value,
            FirstName: this.firstName.value,
            IsCouncilMember: this.isCouncilMember.value,
            LastName: this.lastName.value,
            Password: this.password,
            UserId: this.user.UserId,
            PhoneNumber: this.phoneNumber.value,
            RoleName: this.roleName.value
        };

        if (this.isCouncilMember.value) {
            endDate = this.generateDateString(this.endYear.value, this.endMonth.value, this.endDay.value);
            startDate = this.generateDateString(this.startYear.value, this.startMonth.value, this.startDay.value);

            newUser.HistoryCouncilMember = [{
                StartDate: startDate,
                EndDate: endDate
            }];
        }

        this.userService.updateUser(newUser)
        .subscribe((response: string) => {
            this.toastrService.success(response);
            // this.router.navigate(['user/', this.user.UserId]);
        },
        (error: string) => this.toastrService.error(error));
    }

    userDataChanged() {
        if (this.phoneNumber.value === '') {
            this.phoneNumber.setValue(null);
        }

        let emailChanged = this.user.Email !== this.email.value;
        let endDateChanged = false;
        let firstNameChanged = this.user.FirstName !== this.firstName.value;
        let isCouncilMemberChanged = this.user.IsCouncilMember !== this.isCouncilMember.value;
        let lastNameChanged = this.user.LastName !== this.lastName.value;
        let passwordChanged = this.password !== null;
        let phoneNumberChanged = this.user.PhoneNumber !== this.phoneNumber.value;
        let roleNameChanged = this.user.RoleName !== this.roleName.value;
        let startDateChanged = false;

        if (this.isCouncilMember.value && this.user.IsCouncilMember) {
            let endDate = this.generateDateString(this.endYear.value, this.endMonth.value, this.endDay.value);
            let startDate = this.generateDateString(this.startYear.value, this.startMonth.value, this.startDay.value);

            endDateChanged = this.user.HistoryCouncilMember[0].EndDate !== endDate;
            startDateChanged = this.user.HistoryCouncilMember[0].StartDate !== startDate;
        }

        return (
            emailChanged ||
            endDateChanged ||
            firstNameChanged ||
            isCouncilMemberChanged ||
            lastNameChanged ||
            passwordChanged ||
            phoneNumberChanged ||
            roleNameChanged ||
            startDateChanged
        );
    }

    private buildUserForm() {
        this.email = new FormControl(this.user.Email, [
            Validators.required,
            Validators.pattern(/^[A-Za-z][A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/)
        ]);
        this.firstName = new FormControl(this.user.FirstName, Validators.required);
        this.isCouncilMember = new FormControl(false);
        this.lastName = new FormControl(this.user.LastName, Validators.required);
        this.password = null;
        this.permanentMember = new FormControl(false);
        this.phoneNumber = new FormControl(this.user.PhoneNumber, Validators.pattern(/^[0-9]{3} [0-9]{6,10}$/));
        this.roleName = new FormControl(this.user.RoleName, Validators.required);
        console.log(this.password);

        if (this.user.IsCouncilMember) {
            this.isCouncilMember.setValue(true);

            if (this.user.HistoryCouncilMember[0].EndDate === '9999-12-31') {
                this.permanentMember.setValue(true);
            }
        }

        let startEndDateParse = this.prepareStartEndDates();

        this.endYear = new FormControl(startEndDateParse.EndDate[0], [Validators.required, Validators.min(1900), Validators.max(9999)]);
        this.endMonth = new FormControl(startEndDateParse.EndDate[1], Validators.required);
        this.endDay = new FormControl(startEndDateParse.EndDate[2], Validators.required);

        this.startYear = new FormControl(startEndDateParse.StartDate[0], [Validators.required, Validators.min(1900), Validators.max(9999)]);
        this.startMonth = new FormControl(startEndDateParse.StartDate[1], Validators.required);
        this.startDay = new FormControl(startEndDateParse.StartDate[2], Validators.required);

        this.userForm = new FormGroup({
            email: this.email,
            endDay: this.endDay,
            endMonth: this.endMonth,
            endYear: this.endYear,
            firstName: this.firstName,
            isCouncilMember: this.isCouncilMember,
            lastName: this.lastName,
            permanentMember: this.permanentMember,
            phoneNumber: this.phoneNumber,
            roleName: this.roleName,
            startDay: this.startDay,
            startMonth: this.startMonth,
            startYear: this.startYear
        });

        this.userForm.setValidators([dateValidator(false)]);
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

    private parseDateString(date: string): number[] {
        let dateArray = date.split('-');

        return dateArray.map((value: string) => parseInt(value, 10));
    }

    private prepareStartEndDates() {
        let endDateParse;
        let startDateParse;

        if (this.user.IsCouncilMember) {
            endDateParse = this.parseDateString(this.user.HistoryCouncilMember[0].EndDate);
            startDateParse = this.parseDateString(this.user.HistoryCouncilMember[0].StartDate);
        } else {
            let now = new Date();
            let nextYear = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            endDateParse = this.parseDateString(nextYear.toISOString().split('T')[0]);
            startDateParse = this.parseDateString(now.toISOString().split('T')[0]);
        }

        return {
            EndDate: endDateParse,
            StartDate: startDateParse
        };
    }
}

