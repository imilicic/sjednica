// login.component.ts

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../shared/services/authentication.service';
import { ResponseMessagesService } from '../shared/services/response-messages.service';
import { ToastrService } from '../shared/services/toastr.service';

@Component({
    styleUrls: ['./login.component.css'],
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    email: FormControl;
    loginForm: FormGroup;
    password: FormControl;

    constructor (
        private responseMessagesService: ResponseMessagesService,
        private router: Router,
        private toastrService: ToastrService,
        private authenticationService: AuthenticationService
    ) {}

    ngOnInit() {
        if (this.authenticationService.isAuthenticated()) {
            this.router.navigate(['users']);
        }

        this.email = new FormControl('', Validators.required);
        this.password = new FormControl('', Validators.required);

        this.loginForm = new FormGroup({
            email: this.email,
            password: this.password
        });
    }

    loginUser(): void {
        this.authenticationService.loginUser(this.loginForm.value)
        .subscribe((response: {auth_token: string}) => {
            this.router.navigate(['users']);
        },
        (error: string) => {
            this.toastrService.error(error);
            this.loginForm.reset();
        });
    }

    getWarningMessage(code: string): string {
        return this.responseMessagesService.getMessage({
            location: 'login',
            code: code
        });
    }
}
