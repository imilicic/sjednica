// login-route-activator.service.ts

import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { LoginService } from "./providers/login.service";

@Injectable()
export class LoginRouteActivatorService implements CanActivate {
    constructor(
        private loginService: LoginService,
        private router: Router
    ) {}

    canActivate() {
        if(!this.loginService.isAuthenticated()) {
            this.router.navigate(["login"]);
        }

        return true;
    }
}