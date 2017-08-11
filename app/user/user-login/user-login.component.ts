// login.component.ts

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { ResponseMessagesService } from "../../shared/providers/response-messages.service";
import { ToastrService } from "../../shared/providers/toastr.service";
import { UserService } from "../shared/providers/user.service";

@Component({
    styleUrls: ["app/user/user-login/user-login.component.css"],
    templateUrl: "app/user/user-login/user-login.component.html"
})
export class UserLoginComponent implements OnInit{
    email: FormControl;
    loginForm: FormGroup;
    password: FormControl;

    constructor (
        private responseMessagesService: ResponseMessagesService,
        private router: Router,
        private toastrService: ToastrService,
        private userService: UserService
    ) {}

    ngOnInit() {
        if (this.userService.isAuthenticated()) {
            this.router.navigate(["user"]);
        }

        this.email = new FormControl("", Validators.required);
        this.password = new FormControl("", Validators.required);

        this.loginForm = new FormGroup({
            email: this.email,
            password: this.password
        });
    }

    login(): void {
        this.userService.login(this.loginForm.value).subscribe((response: {auth_token: string}) => {
            this.router.navigate(["user"]);
        },
        (error: string) => {
            this.toastrService.error(error);
            this.loginForm.reset();
        });
    }

    getWarningMessage(code: string): string {
        return this.responseMessagesService.getMessage({
            location: "login",
            code: code
        });
    }
}