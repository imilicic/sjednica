// login.component.ts

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    styleUrls: ["app/login/login.component.css"],
    templateUrl: "app/login/login.component.html"
})
export class LoginComponent implements OnInit{
    email: FormControl;
    password: FormControl;
    loginForm: FormGroup;

    constructor (
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
        console.log(values);
    }
}