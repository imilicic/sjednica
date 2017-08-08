// login.component.ts

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { ResponseMessagesService } from "../shared/providers/response-messages.service";
import { UserService } from "../shared/providers/user.service";
import { User } from "../shared/models/user.model";

@Component({
    styleUrls: ["app/login/login.component.css"],
    templateUrl: "app/login/login.component.html"
})
export class LoginComponent implements OnInit{
    email: FormControl;
    password: FormControl;
    loginForm: FormGroup;

    constructor (
        private responseMessagesService: ResponseMessagesService,
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit() {
        if (this.userService.isAuthenticated()) {
            this.router.navigate(["users"]);
        }

        this.email = new FormControl("", Validators.required);
        this.password = new FormControl("", Validators.required);

        this.loginForm = new FormGroup({
            email: this.email,
            password: this.password
        });
    }

    login(values: any) {
        this.userService.login(values).subscribe((response: any) => {
            this.responseMessagesService.setResponseMessage({
                location: "login",
                code: response.message
            });
            
            if (response.success) {
                this.router.navigate(["users"]);
            } else {
                this.loginForm.reset();
            }
        });
    }

    getWarningMessage(code: string) {
        return this.responseMessagesService.getMessage({
            location: "login",
            code: code
        });
    }
}