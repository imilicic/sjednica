// login-route-activator.service.ts

import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { UserService } from "./providers/user.service";

@Injectable()
export class UserRouteActivatorService implements CanActivate {
    constructor(
        private userService: UserService,
        private router: Router
    ) {}

    canActivate() {
        if(!this.userService.isAuthenticated()) {
            this.router.navigate(["login"]);
        }

        return true;
    }
}