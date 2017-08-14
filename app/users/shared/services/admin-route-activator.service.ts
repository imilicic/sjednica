import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from '../../../shared/services/authentication.service';

@Injectable()
export class AdminRouteActivatorService implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    canActivate() {
        if (this.authenticationService.isAdmin()) {
            return true;
        }

        this.router.navigate(['users/me']);
        return false;
    }
}
