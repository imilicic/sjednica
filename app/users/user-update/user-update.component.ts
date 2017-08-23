import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CouncilMembership } from '../../shared/models/council-membership.model';
import { Roles } from '../../shared/models/roles.enum';
import { User } from '../../shared/models/user.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { PasswordService } from '../../shared/services/password.service';
import { ResponseMessagesService } from '../../shared/services/response-messages.service';
import { ToastrService } from '../../shared/services/toastr.service';
import { CouncilMembershipService } from '../shared/services/council-membership.service';
import { UserService } from '../shared/services/user.service';
import { areEqual, dateValidator } from '../shared/validators';

@Component({
    styleUrls: ['./user-update.component.css'],
    templateUrl: './user-update.component.html'
})
export class UserUpdateComponent implements OnInit {
    private isThisCurrentUserProfile: boolean;
    private months: string[];
    private roles: any;
    private user: User;

    // form controls for general user
    private email: FormControl;
    private endDay: FormControl;
    private endMonth: FormControl;
    private endYear: FormControl;
    private firstName: FormControl;
    private isCouncilMember: FormControl;
    private lastName: FormControl;
    private password: string;
    private permanentMember: FormControl;
    private phoneNumber: FormControl;
    private roleName: FormControl;
    private startDay: FormControl;
    private startMonth: FormControl;
    private startYear: FormControl;
    private userForm: FormGroup;

    // form controls for current user
    private oldPassword: FormControl;
    private newPassword: FormControl;
    private newPassword2: FormControl;

    constructor (
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private councilMembershipService: CouncilMembershipService,
        private passwordService: PasswordService,
        private responseMessagesService: ResponseMessagesService,
        private router: Router,
        private toastrService: ToastrService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.isThisCurrentUserProfile = false;
        this.months = [
            'siječanj', 'veljača', 'ožujak', 'travanj',
            'svibanj', 'lipanj', 'srpanj', 'kolovoz',
            'rujan', 'listopad', 'studeni', 'prosinac'
        ];
        this.roles = Roles;

        if (this.activatedRoute.snapshot.params['userId']) {
            this.user = this.activatedRoute.snapshot.data['user'];
            this.user.CouncilMemberships = this.activatedRoute.snapshot.data['councilMemberships'];
            this.isThisCurrentUserProfile = false;
            this.buildGeneralUserForm();
        } else {
            this.user = this.authenticationService.user;
            this.isThisCurrentUserProfile = true;
            this.buildCurrentUserForm();
        }
    }

    private buildCurrentUserForm() {
        this.newPassword = new FormControl('', [
            Validators.required,
            Validators.pattern(/^(?=[^a-zA-Z]*[a-zA-Z])(?=[^0-9]*[0-9]).*$/),
            Validators.minLength(8)
        ]);
        this.newPassword2 = new FormControl('', Validators.required);
        this.oldPassword = new FormControl('', Validators.required);

        this.userForm = new FormGroup({
            newPassword: this.newPassword,
            newPassword2: this.newPassword2,
            oldPassword: this.oldPassword
        });

        this.userForm.setValidators([areEqual('newPassword', 'newPassword2')]);
    }

    private buildGeneralUserForm() {
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

        if (this.user.CouncilMemberships && this.user.CouncilMemberships.IsCouncilMember) {
            this.isCouncilMember.setValue(true);

            if (this.user.CouncilMemberships.History[0].EndDate === '9999-12-31') {
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

    private changeEndDate() {
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

    private changeUserPassword(action: boolean) {
        if (action) {
            this.password = this.passwordService.generatePassword(8, 4, 2);
            console.log(this.password);
        } else {
            this.password = null;
        }
    }

    private councilMemberDataChanged() {
        let endDateChanged = false;
        let startDateChanged = false;

        if (this.isCouncilMember.value && this.user.CouncilMemberships.IsCouncilMember) {
            let endDate = this.generateDateString(this.endYear.value, this.endMonth.value, this.endDay.value);
            let startDate = this.generateDateString(this.startYear.value, this.startMonth.value, this.startDay.value);

            endDateChanged = this.user.CouncilMemberships.History[0].EndDate !== endDate;
            startDateChanged = this.user.CouncilMemberships.History[0].StartDate !== startDate;
        }

        return endDateChanged || startDateChanged;
    }

    private createCouncilMembership() {
        let endDate = this.generateDateString(this.endYear.value, this.endMonth.value, this.endDay.value);
        let startDate = this.generateDateString(this.startYear.value, this.startMonth.value, this.startDay.value);
        let newCouncilMembership: CouncilMembership = {
            IsCouncilMember: this.isCouncilMember.value,
            History: [{
                CouncilMembershipId: undefined,
                StartDate: startDate,
                EndDate: endDate
            }]
        };

        this.councilMembershipService.createCouncilMembership(this.user.UserId, newCouncilMembership)
        .subscribe((councilMembership: CouncilMembership) => {
            this.toastrService.success('Korisnik je dodan u vijeće!');
            this.router.navigate(['users/', this.user.UserId]);
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }

    private deleteCouncilMembership(councilMembershipId: number) {
        this.councilMembershipService.deleteCouncilMembership(this.user.UserId, councilMembershipId)
        .subscribe((response: string) => {
            this.toastrService.success(response);
            this.router.navigate(['users/', this.user.UserId]);
        }, (error: string) => {
            this.toastrService.error(error);
        })
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
            location: 'users/update',
            code: code
        });
    }

    private getWarningMessageCurrentUser(code: string) {
        return this.responseMessagesService.getMessage({
            location: 'users/update/me',
            code: code
        });
    }

    private parseDateString(date: string): number[] {
        let dateArray = date.split('-');

        return dateArray.map((value: string) => parseInt(value, 10));
    }

    private prepareStartEndDates() {
        let endDateParse;
        let startDateParse;

        if (this.user.CouncilMemberships && this.user.CouncilMemberships.IsCouncilMember) {
            endDateParse = this.parseDateString(this.user.CouncilMemberships.History[0].EndDate);
            startDateParse = this.parseDateString(this.user.CouncilMemberships.History[0].StartDate);
        } else {
            let now = new Date();
            let nextYear = new Date(Date.UTC(now.getFullYear() + 1, now.getMonth(), now.getDate()));

            endDateParse = this.parseDateString(nextYear.toISOString().split('T')[0]);
            startDateParse = this.parseDateString(now.toISOString().split('T')[0]);
        }

        return {
            EndDate: endDateParse,
            StartDate: startDateParse
        };
    }

    private range(n: number): number[] {
        let result = [];

        for (let i = 1; i <= n; i++) {
            result.push(i);
        }

        return result;
    }

    private setDefaultDates() {
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

    private updateCouncilMembership(councilMembershipId: number) {
        let endDate = this.generateDateString(this.endYear.value, this.endMonth.value, this.endDay.value);
        let startDate = this.generateDateString(this.startYear.value, this.startMonth.value, this.startDay.value);

        let newCouncilMembership: CouncilMembership = {
            IsCouncilMember: true,
            History: [{
                CouncilMembershipId: councilMembershipId,
                StartDate: startDate,
                EndDate: endDate
            }]
        };

        this.councilMembershipService.updateCouncilMembership(this.user.UserId, councilMembershipId, newCouncilMembership)
        .subscribe((councilMembership: CouncilMembership) => {
            this.toastrService.success('Članstvo u vijeću promijenjeno!');
            this.router.navigate(['users/', this.user.UserId]);
        }, (error: string) => {
            this.toastrService.error(error);
        })
    }

    private updateUserByAdmin() {
        let newUser: User = {
            Email: this.email.value,
            FirstName: this.firstName.value,
            LastName: this.lastName.value,
            Password: this.password,
            UserId: this.user.UserId,
            PhoneNumber: this.phoneNumber.value,
            RoleName: this.roleName.value
        };

        this.userService.updateUser(newUser)
        .subscribe((user: User) => {
            this.toastrService.success('Korisnički podaci su promjenjeni!');

            if (this.isCouncilMember.value && !this.user.CouncilMemberships.IsCouncilMember) {
                this.createCouncilMembership();
            } else if (!this.isCouncilMember.value && this.user.CouncilMemberships.IsCouncilMember) {
                this.deleteCouncilMembership(this.user.CouncilMemberships.History[0].CouncilMembershipId);
            } else if (this.councilMemberDataChanged()) {
                this.updateCouncilMembership(this.user.CouncilMemberships.History[0].CouncilMembershipId);
            } else {
                this.router.navigate(['users/', this.user.UserId]);
            }
        },
        (error: string) => this.toastrService.error(error));
    }

    private updateUserByUser() {
        let newPassword = {
            NewPassword: this.newPassword.value,
            OldPassword: this.oldPassword.value,
            UserId: this.user.UserId
        };

        this.userService.updateUser(newPassword)
        .subscribe((response: string) => {
            this.toastrService.success('Lozinka je promijenjena!');

            this.router.navigate(['users/me']);
        }, (error: string) => {
            this.toastrService.error(error);
        })
    }

    private userDataChanged() {
        if (this.phoneNumber.value === '') {
            this.phoneNumber.setValue(null);
        }

        let emailChanged = this.user.Email !== this.email.value;
        let firstNameChanged = this.user.FirstName !== this.firstName.value;
        let isCouncilMemberChanged = this.user.CouncilMemberships &&
            this.user.CouncilMemberships.IsCouncilMember !== this.isCouncilMember.value;
        let lastNameChanged = this.user.LastName !== this.lastName.value;
        let passwordChanged = this.password !== null;
        let phoneNumberChanged = this.user.PhoneNumber !== this.phoneNumber.value;
        let roleNameChanged = this.user.RoleName !== this.roleName.value;

        return (
            this.councilMemberDataChanged() ||
            emailChanged ||
            firstNameChanged ||
            isCouncilMemberChanged ||
            lastNameChanged ||
            passwordChanged ||
            phoneNumberChanged ||
            roleNameChanged
        );
    }
}
