// login-route-activator.service.ts

import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";

import { LoginService } from "./providers/login.service";

@Injectable()
export class LoginRouteActivatorService implements CanActivate {
    constructor(private loginService: LoginService) {}

    canActivate() {
        return this.loginService.isAuthenticated();
    }
}