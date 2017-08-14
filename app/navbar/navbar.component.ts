// navbar.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
    selector: 'navbar',
    styleUrls: ['app/navbar/navbar.component.css'],
    templateUrl: 'app/navbar/navbar.component.html'
})
export class NavbarComponent {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    logoutUser() {
        this.authenticationService.logoutUser();
        this.router.navigate(['login']);
    }
}
