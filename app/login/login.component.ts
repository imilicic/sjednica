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
    private email: FormControl;
    private loginForm: FormGroup;
    private password: FormControl;

    constructor (
        private authenticationService: AuthenticationService,
        private responseMessagesService: ResponseMessagesService,
        private router: Router,
        private toastrService: ToastrService
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

    private getWarningMessage(code: string): string {
        return this.responseMessagesService.getMessage({
            location: 'login',
            code: code
        });
    }

    private loginUser(): void {
        let newUserLogin = {
            Email: this.email.value,
            Password: this.password.value
        };

        this.authenticationService.loginUser(newUserLogin)
            .subscribe((response: {auth_token: string}) => {
                this.router.navigate(['users']);
            }, (error: string) => {
                this.toastrService.error(error);
                this.loginForm.reset();
            });
    }
}
