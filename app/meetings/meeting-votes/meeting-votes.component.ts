import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VoteService } from '../shared/services/vote.service';
import { Meeting } from '../../shared/models/meeting.model';
import { ToastrService } from '../../shared/services/toastr.service';

@Component({
    templateUrl: './meeting-votes.component.html'
})
export class MeetingVotesComponent implements OnInit {
    private meeting: Meeting;
    private votes: any[];

    constructor(
        private activatedRoute: ActivatedRoute,
        private toastrService: ToastrService,
        private voteService: VoteService
    ) {}

    ngOnInit() {
        this.meeting = this.activatedRoute.snapshot.data['meeting'];
        this.votes = [];

        this.voteService.readVotes(this.meeting.MeetingId)
        .subscribe((response: any[]) => {
            this.votes = response;
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }

    private createVotingView() {
        let votingAgainst = 0;
        let votingAbstain = 0;
        let votingFor = 0;

        this.votes.forEach((el: any) => {
            if (el.Vote === 0) {
                votingAgainst++;
            } else if (el.Vote === 1) {
                votingAbstain++;
            } else if (el.Vote === 2) {
                votingFor++;
            }
        });

        return [votingAgainst, votingAbstain, votingFor];
    }
}
