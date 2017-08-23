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
        private authenticationService: AuthenticationService,
        private router: Router
    ) {}

    private logoutUser() {
        this.authenticationService.logoutUser();
        this.router.navigate(['login']);
    }
}
