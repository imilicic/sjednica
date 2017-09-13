import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CouncilMember } from '../../shared/models/council-member.model';

@Component({
    templateUrl: './council-member.component.html'
})

export class CouncilMemberComponent implements OnInit {
    private councilMember: CouncilMember;

    constructor(
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.councilMember = this.activatedRoute.snapshot.data['councilMember'];
    }
}
