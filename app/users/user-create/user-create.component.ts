import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CouncilMembership } from '../../shared/models/council-membership.model';
import { User } from '../../shared/models/user.model';
import { PasswordService } from '../../shared/services/password.service';
import { ResponseMessagesService } from '../../shared/services/response-messages.service';
import { RoleService } from '../../shared/services/role.service';
import { ToastrService } from '../../shared/services/toastr.service';
import { UserService } from '../shared/services/user.service';

@Component({
    styleUrls: ['./user-create.component.css'],
    templateUrl: './user-create.component.html'
})
export class UserCreateComponent implements OnInit {
    private email: FormControl;
    private firstName: FormControl;
    private lastName: FormControl;
    private months: string[];
    private password: FormControl;
    private phoneNumber: FormControl;
    private roleId: FormControl;
    private userForm: FormGroup;

    constructor(
        private passwordService: PasswordService,
        private responseMessagesService: ResponseMessagesService,
        private roleService: RoleService,
        private router: Router,
        private toastrService: ToastrService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.months = [
            'siječanj', 'veljača', 'ožujak', 'travanj',
            'svibanj', 'lipanj', 'srpanj', 'kolovoz',
            'rujan', 'listopad', 'studeni', 'prosinac'
        ];
        this.buildForm();
    }

    private buildForm() {
        this.email = new FormControl('', [
            Validators.required,
            Validators.pattern(/^[A-Za-z][A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/)
        ]);
        this.firstName = new FormControl('', Validators.required);
        this.lastName = new FormControl('', Validators.required);
        this.password = new FormControl({
            value: '********',
            disabled: true
        }, Validators.required);
        this.phoneNumber = new FormControl(undefined, Validators.pattern(/^[0-9]{3} [0-9]{6,10}$/));
        this.roleId = new FormControl(2, Validators.required);

        this.userForm = new FormGroup({
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password,
            phoneNumber: this.phoneNumber,
            roleId: this.roleId
        });
    }

    private createUser() {
        let newUser: User = {
            Email: this.email.value,
            FirstName: this.firstName.value,
            LastName: this.lastName.value,
            Password: this.passwordService.generatePassword(8, 4, 2),
            PhoneNumber: this.phoneNumber.value,
            RoleId: this.roleId.value,
            UserId: undefined
        };

        this.userService.createUser(newUser)
        .subscribe((user: User) => {
            this.toastrService.success('Korisnik je izrađen!');
            this.router.navigate(['users/', user.UserId]);
        }, (error: string) => {
            this.toastrService.error(error)
        });
    }

    private getWarningMessage(code: string) {
        return this.responseMessagesService.getMessage({
            location: 'users/create',
            code: code
        });
    }
}

