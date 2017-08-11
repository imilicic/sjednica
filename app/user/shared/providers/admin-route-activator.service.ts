import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { UserService } from "./user.service";

@Injectable()
export class AdminRouteActivatorService implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService
    ) {}

    canActivate() {
        if (this.userService.isAdmin()) {
            return true;
        }

        this.router.navigate(["user/me"]);
        return false;
    }
}