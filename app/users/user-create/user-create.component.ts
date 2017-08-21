import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CouncilMembership } from '../../shared/models/council-membership.model';
import { User } from '../../shared/models/user.model';
import { PasswordService } from '../../shared/services/password.service';
import { ResponseMessagesService } from '../../shared/services/response-messages.service';
import { ToastrService } from '../../shared/services/toastr.service';
import { CouncilMembershipService } from '../shared/services/council-membership.service';
import { UserService } from '../shared/services/user.service';
import { dateValidator } from '../shared/validators';

@Component({
    styleUrls: ['./user-create.component.css'],
    templateUrl: './user-create.component.html'
})
export class UserCreateComponent implements OnInit {
    isCouncilMember: FormControl;
    email: FormControl;
    firstName: FormControl;
    lastName: FormControl;
    password: string;
    permanentMember: FormControl;
    phoneNumber: FormControl;
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

    addRemoveDateControls() {
        if (this.isCouncilMember.value) {
            this.userForm.addControl('startDay', this.startDay);
            this.userForm.addControl('startMonth', this.startMonth);
            this.userForm.addControl('startYear', this.startYear);

            if (this.permanentMember.value) {
                this.endDay.setValue(31);
                this.endMonth.setValue(12);
                this.endYear.setValue(9999);
            } else {
                this.endDay.setValue(this.startDay.value);
                this.endMonth.setValue(this.startMonth.value);
                this.endYear.setValue(this.startYear.value + 1);
            }

            this.userForm.addControl('endDay', this.endDay);
            this.userForm.addControl('endMonth', this.endMonth);
            this.userForm.addControl('endYear', this.endYear);

            this.userForm.addControl('permanentMember', this.permanentMember);

            this.userForm.setValidators(dateValidator(true));
        } else {
            this.userForm.clearValidators();

            this.userForm.removeControl('startDay');
            this.userForm.removeControl('startMonth');
            this.userForm.removeControl('startYear');

            this.userForm.removeControl('endDay');
            this.userForm.removeControl('endMonth');
            this.userForm.removeControl('endYear');

            this.userForm.removeControl('permanentMember');
            this.permanentMember.setValue(false);
        }
    }

    constructor(
        private councilMembershipService: CouncilMembershipService,
        private passwordService: PasswordService,
        private responseMessagesService: ResponseMessagesService,
        private router: Router,
        private toastrService: ToastrService,
        private userService: UserService
    ) {}

    createCouncilMembership(userId: number) {
        let endDate = this.generateDateString(this.endYear.value, this.endMonth.value, this.endDay.value);
        let startDate = this.generateDateString(this.startYear.value, this.startMonth.value, this.startDay.value);

        let newCouncilMembership: CouncilMembership = {
            IsCouncilMember: this.isCouncilMember.value,
            History: [{
                StartDate: startDate,
                EndDate: endDate
            }]
        };

        this.councilMembershipService.createCouncilMembership(userId, newCouncilMembership)
        .subscribe((councilMembership: CouncilMembership) => {
            this.toastrService.success('Korisnik je dodan u vijeće!');
            this.router.navigate(['users']);
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }

    createUser() {
        let newUser: User = {
            Email: this.email.value,
            FirstName: this.firstName.value,
            LastName: this.lastName.value,
            Password: this.password,
            UserId: undefined,
            PhoneNumber: this.phoneNumber.value,
            RoleName: 'user'
        };

        this.userService.createUser(newUser)
        .subscribe((user: User) => {
            this.toastrService.success('Korisnik je izrađen!');

            if (this.isCouncilMember.value) {
                this.createCouncilMembership(user.UserId);
            } else {
                this.router.navigate(['users']);
            }
        }, (error: string) => {
            this.toastrService.error(error)
        });
    }

    ngOnInit() {
        let currentDate = new Date();
        this.startDay = new FormControl(currentDate.getDate(), Validators.required);
        this.startMonth = new FormControl(currentDate.getMonth() + 1, Validators.required);
        this.startYear = new FormControl(currentDate.getFullYear(), [Validators.required, Validators.min(1900), Validators.max(9999)]);

        this.permanentMember = new FormControl(false);
        let dateNextYear = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
        this.endDay = new FormControl(dateNextYear.getDate(), Validators.required);
        this.endMonth = new FormControl(dateNextYear.getMonth() + 1, Validators.required);
        this.endYear = new FormControl(dateNextYear.getFullYear(), [Validators.required, Validators.min(1900), Validators.max(9999)]);

        this.password = this.passwordService.generatePassword(8, 4, 2);
        console.log(this.password);

        this.isCouncilMember = new FormControl(false);
        this.email = new FormControl('', [
            Validators.required,
            Validators.pattern(/^[A-Za-z][A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/)
        ]);
        this.firstName = new FormControl('', Validators.required);
        this.lastName = new FormControl('', Validators.required);
        this.phoneNumber = new FormControl(undefined, Validators.pattern(/^[0-9]{3} [0-9]{6,10}$/));

        this.userForm = new FormGroup({
            isCouncilMember: this.isCouncilMember,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber
        });
    }

    range(n: number): number[] {
        let result = [];

        for (let i = 1; i <= n; i++) {
            result.push(i);
        }

        return result;
    }

    getWarningMessage(code: string) {
        return this.responseMessagesService.getMessage({
            location: 'createUser',
            code: code
        });
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
}

