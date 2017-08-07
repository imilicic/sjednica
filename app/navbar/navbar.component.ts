// navbar.component.ts

import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { LoginService } from "../shared/providers/login.service";

@Component({
    selector: "navbar",
    styleUrls: ["app/navbar/navbar.component.css"],
    templateUrl: "app/navbar/navbar.component.html"
})
export class NavbarComponent {
    constructor(
        private loginService: LoginService,
        private router: Router
    ) {}

    logout() {
        this.loginService.logout();
        this.router.navigate(["login"]);
    }
}