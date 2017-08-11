// navbar.component.ts

import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { UserService } from "../user/shared/providers/user.service";

@Component({
    selector: "navbar",
    styleUrls: ["app/navbar/navbar.component.css"],
    templateUrl: "app/navbar/navbar.component.html"
})
export class NavbarComponent {
    constructor(
        private router: Router,
        private userService: UserService
    ) {}

    logout() {
        this.userService.logout();
        this.router.navigate(["user/login"]);
    }
}