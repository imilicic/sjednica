import { Component, OnInit } from '@angular/core';

import { CouncilMember } from '../shared/models/council-member.model';
import { CouncilMemberService } from './shared/services/council-member.service';

@Component({
    templateUrl: './council-members.component.html'
})
export class CouncilMembersComponent implements OnInit {
    private councilMembers: CouncilMember[];

    constructor(
        private councilMemberService: CouncilMemberService
    ) {}

    ngOnInit() {
        this.councilMembers = [];

        this.councilMemberService.retrieveCouncilMembers()
        .subscribe((councilMembers: CouncilMember[]) => {
            this.councilMembers = councilMembers;
        })
    }
}
