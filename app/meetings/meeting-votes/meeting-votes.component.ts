import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AgendaItemService } from '../agenda-items/shared/services/agenda-item.service';
import { MeetingService } from '../shared/services/meeting.service';
import { VoteService } from '../shared/services/vote.service';
import { AgendaItem } from '../../shared/models/agenda-item.model';
import { CummulativeVote } from '../../shared/models/cummulative-vote.model';
import { Meeting } from '../../shared/models/meeting.model';
import { ToastrService } from '../../shared/services/toastr.service';

@Component({
    templateUrl: './meeting-votes.component.html'
})
export class MeetingVotesComponent implements OnInit {
    private absence: number;
    private meeting: Meeting;
    private presence: number;
    private votes: CummulativeVote[];

    constructor(
        private activatedRoute: ActivatedRoute,
        private agendaItemService: AgendaItemService,
        private meetingService: MeetingService,
        private toastrService: ToastrService,
        private voteService: VoteService
    ) {}

    ngOnInit() {
        this.meeting = this.activatedRoute.snapshot.data['meeting'];
        this.meeting.AgendaItems = this.activatedRoute.snapshot.data['agendaItems'];
        this.votes = [];

        this.meeting.AgendaItems.forEach((agendaItem: AgendaItem) => {
            this.voteService.retrieveCummulativeVote(this.meeting.MeetingId, agendaItem.AgendaItemId)
            .subscribe((response: CummulativeVote) => {
                this.votes.push(response);
            }, (error: string) => {
                this.toastrService.error(error);
            });
        });

        this.meetingService.retrieveAbsenceCount(this.meeting.MeetingId)
        .subscribe((result: any) => {
            this.absence = result.Number;
        });

        this.meetingService.retrievePresenceCount(this.meeting.MeetingId)
        .subscribe((result: any) => {
            this.presence = result.Number;
        });
    }

    private totalVotes(agendaItemId: number): number {
        let sum = 0;
        let vote = this.viewVotes(agendaItemId);

        if (vote) {
            if (vote.hasOwnProperty('VotesAbstain')) {
                sum += vote.VotesAbstain;
            }

            if (vote.hasOwnProperty('VotesAgainst')) {
                sum += vote.VotesAgainst;
            }

            if (vote.hasOwnProperty('VotesFor')) {
                sum += vote.VotesFor;
            }

            return sum;
        }

        return NaN;
    }

    private viewVotes(agendaItemId: number): CummulativeVote {
        return this.votes.find((vote: any) => vote.AgendaItemId === agendaItemId);
    }
}
