// login.component.ts

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { LoginService } from "./login.service";
import { User } from "../shared/models/user.model";

@Component({
    styleUrls: ["app/login/login.component.css"],
    templateUrl: "app/login/login.component.html"
})
export class LoginComponent implements OnInit{
    responseMessage: string = "";

    email: FormControl;
    password: FormControl;
    loginForm: FormGroup;

    constructor (
        private loginService: LoginService,
        private router: Router
    ) {}

    ngOnInit() {
        this.email = new FormControl("", Validators.required);
        this.password = new FormControl("", Validators.required);

        this.loginForm = new FormGroup({
            email: this.email,
            password: this.password
        });
    }

    login(values: any) {
        this.loginService.login(values).subscribe((response: any) => {
            if (response.success) {
                //this.router.navigate([""]);
                console.log(response);
            } else {
                this.loginForm.reset();
                this.responseMessage = response.message;
            }
        });
    }
}