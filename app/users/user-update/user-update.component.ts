import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../shared/models/user.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { PasswordService } from '../../shared/services/password.service';
import { ResponseMessagesService } from '../../shared/services/response-messages.service';
import { RoleService } from '../../shared/services/role.service';
import { ToastrService } from '../../shared/services/toastr.service';
import { UserService } from '../shared/services/user.service';
import { areEqual } from '../shared/validators';

@Component({
    styleUrls: ['./user-update.component.css'],
    templateUrl: './user-update.component.html'
})
export class UserUpdateComponent implements OnInit {
    private isThisCurrentUserProfile: boolean;
    private months: string[];
    private user: User;

    // form controls for general user
    private email: FormControl;
    private firstName: FormControl;
    private lastName: FormControl;
    private password: FormControl;
    private phoneNumber: FormControl;
    private roleId: FormControl;
    private userForm: FormGroup;

    // form controls for current user
    private oldPassword: FormControl;
    private newPassword: FormControl;
    private newPassword2: FormControl;

    constructor (
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private passwordService: PasswordService,
        private responseMessagesService: ResponseMessagesService,
        private roleService: RoleService,
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

        if (this.activatedRoute.snapshot.params['userId']) {
            this.user = this.activatedRoute.snapshot.data['user'];
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
        this.lastName = new FormControl(this.user.LastName, Validators.required);
        this.password = new FormControl({
            value: '00000000',
            disabled: true
        }, Validators.required);
        this.phoneNumber = new FormControl(this.user.PhoneNumber, Validators.pattern(/^[0-9]{3} [0-9]{6,10}$/));
        this.roleId = new FormControl(this.user.RoleId, Validators.required);

        this.userForm = new FormGroup({
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password,
            phoneNumber: this.phoneNumber,
            roleId: this.roleId,
        });
    }

    private changeUserPassword(action: boolean) {
        if (action) {
            this.password.setValue(this.passwordService.generatePassword(8, 4, 2));
            console.log(this.password.value);
        } else {
            this.password.setValue('00000000');
        }
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

    private updateUserByAdmin() {
        let newUser: User = {
            Email: this.email.value,
            FirstName: this.firstName.value,
            LastName: this.lastName.value,
            Password: this.password.value,
            PhoneNumber: this.phoneNumber.value,
            RoleId: +this.roleId.value,
            UserId: this.user.UserId
        };

        this.userService.replaceUser(newUser)
        .subscribe((user: User) => {
            this.toastrService.success('Korisnički podaci su promjenjeni!');
            this.router.navigate(['users/', this.user.UserId]);
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }

    private updateUserByUser() {
        let newUser = this.authenticationService.user;
        newUser.Password = this.newPassword.value;

        this.userService.replaceUser(newUser)
        .subscribe((response: User) => {
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
        let lastNameChanged = this.user.LastName !== this.lastName.value;
        let passwordChanged = this.password !== null;
        let phoneNumberChanged = this.user.PhoneNumber !== this.phoneNumber.value;
        let roleIdChanged = this.user.RoleId !== this.roleId.value;

        return (
            emailChanged ||
            firstNameChanged ||
            lastNameChanged ||
            passwordChanged ||
            phoneNumberChanged ||
            roleIdChanged
        );
    }
}
