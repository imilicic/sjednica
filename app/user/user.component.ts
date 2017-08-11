import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { User } from "./shared/models/user.model";
import { ToastrService } from "../shared/providers/toastr.service";
import { UserService } from "./shared/providers/user.service";

@Component({
    templateUrl: "app/user/user.component.html"
})
export class UserComponent implements OnInit { 
    users: User[];

    constructor(
        private router: Router,
        private toastrService: ToastrService,
        private userService: UserService
    ) {}

    ngOnInit() {
        if(!this.userService.isAdmin()) {
            this.router.navigate(["user/me"]);
        } else {
            this.userService.getUsers().subscribe((users: User[]) => {
                this.users = users;
            }, (error: string) => {
                this.toastrService.error(error);
            });
        }
    }
}