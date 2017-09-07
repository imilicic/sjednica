import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { RoleService } from '../../shared/services/role.service';
import { User } from '../../shared/models/user.model';

@Component({
    templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
    private isThisCurrentUserProfile: boolean;
    private user: User;

    constructor(
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private roleService: RoleService
    ) {}

    ngOnInit() {
        if (this.activatedRoute.snapshot.params['userId']) {
            this.user = this.activatedRoute.snapshot.data['user'];
            this.user.CouncilMemberships = this.activatedRoute.snapshot.data['councilMemberships'];
            this.isThisCurrentUserProfile = false;
        } else {
            this.user = this.authenticationService.user;
            this.isThisCurrentUserProfile = true;
        }
    }

    private isCouncilMember() {
        let startDate = new Date(this.user.CouncilMemberships[0].StartDate);
        let endDate = new Date(this.user.CouncilMemberships[0].EndDate);
        let now = new Date();

        return (startDate <= now && now <= endDate);
    }

    private isPermanentCouncilMember() {
        if (this.user.CouncilMemberships[0].EndDate === '9999-12-31') {
            return true;
        } else {
            return false;
        }
    }
}
