import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { User } from '../../shared/models/user.model';

@Component({
    templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
    private isThisCurrentUserProfile: boolean;
    private user: User;

    constructor(
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService
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

    private isPermanentCouncilMember() {
        if (this.user.CouncilMemberships.History[0].EndDate === '9999-12-31') {
            return true;
        } else {
            return false;
        }
    }
}
