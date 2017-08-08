// navbar.component.ts

import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { UserService } from "../shared/providers/user.service";

@Component({
    selector: "navbar",
    styleUrls: ["app/navbar/navbar.component.css"],
    templateUrl: "app/navbar/navbar.component.html"
})
export class NavbarComponent {
    constructor(
        private userService: UserService,
        private router: Router
    ) {}

    logout() {
        this.userService.logout();
        this.router.navigate(["login"]);
    }
}