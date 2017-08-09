// login-route-activator.service.ts

import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { UserService } from "./providers/user.service";

@Injectable()
export class UserRouteActivatorService implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService
    ) {}

    canActivate() {
        if(this.userService.isAuthenticated()) {
            return true; 
        }

        this.router.navigate(["login"]);
        return false;
    }
}