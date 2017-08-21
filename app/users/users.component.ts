import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../shared/models/user.model';
import { UserService } from './shared/services/user.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { ToastrService } from '../shared/services/toastr.service';

@Component({
    templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
    users: User[];

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
        private toastrService: ToastrService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.userService.getUsers().subscribe((users: User[]) => {
            this.users = users;
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }
}
