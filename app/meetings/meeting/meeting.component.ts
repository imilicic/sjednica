import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AgendaItem } from '../../shared/models/agenda-item.model';
import { AgendaItemService } from '../shared/services/agenda-item.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { CummulativeVote } from '../../shared/models/cummulative-vote.model';
import { CummulativeVoteService } from '../shared/services/cummulative-vote.service';
import { Meeting } from '../../shared/models/meeting.model';
import { VoteService } from '../shared/services/vote.service';
import { VotingService } from '../shared/services/voting.service';
import { ToastrService } from '../../shared/services/toastr.service';
import { TypeService } from '../../shared/services/type.service';

@Component({
    templateUrl: './meeting.component.html'
})

export class MeetingComponent implements OnInit {
    private interval: any;
    private meeting: Meeting;
    private votes: any;
    private votings: number[];

    // non electronic
    cummulativeVoteResult: CummulativeVote[];
    voted: boolean[];
    votesFor: FormControl[];
    votesForm: FormGroup[];
    votesAbstain: FormControl[];
    votesAgainst: FormControl[];

    constructor(
        private activatedRoute: ActivatedRoute,
        private agendaItemService: AgendaItemService,
        private authenticationService: AuthenticationService,
        private cummulativeVoteService: CummulativeVoteService,
        private toastrService: ToastrService,
        private typeService: TypeService,
        private voteService: VoteService,
        private votingService: VotingService
    ) { }

    ngOnDestroy() {
        if (!this.authenticationService.isAdmin()) {
            clearInterval(this.interval);
        }
    }

    ngOnInit() {
        this.meeting = this.activatedRoute.snapshot.data['meeting'];
        this.meeting.AgendaItems = this.activatedRoute.snapshot.data['agendaItems'];
        this.votes = [];
        this.votings = [];

        switch (this.meeting.TypeId) {
            case 1:
                console.log(1);
                break;
            case 2:
                // electronic remotely
                console.log(2);
                break;
            case 3:
                // non-electronic
                this.buildForm();
                break;
        }
    }

    private buildForm() {
        this.cummulativeVoteResult = [];
        this.voted = [];
        this.votesAbstain = [];
        this.votesAgainst = [];
        this.votesFor = [];
        this.votesForm = [];

        this.meeting.AgendaItems.forEach((agendaItem, i) => {
            this.votesFor.push(new FormControl(0, [Validators.required, Validators.min(0)]));
            this.votesAbstain.push(new FormControl(0, [Validators.required, Validators.min(0)]));
            this.votesAgainst.push(new FormControl(0, [Validators.required, Validators.min(0)]));

            this.votesForm.push(new FormGroup({
                votesFor: this.votesFor[i],
                votesAbstain: this.votesAbstain[i],
                votesAgainst: this.votesAgainst[i]
            }));

            this.voted.push(false);
            this.cummulativeVoteResult.push({
                AgendaItemId: agendaItem.AgendaItemId,
                VotesAbstain: null,
                VotesAgainst: null,
                VotesFor: null
            });

            this.cummulativeVoteService.retrieveCummulativeVote(this.meeting.MeetingId, agendaItem.AgendaItemId)
            .subscribe((vote: CummulativeVote) => {
                if (vote.VotesFor !== null) {
                    this.voted[i] = true;
                }

                this.cummulativeVoteResult[i] = vote;
            });
        });
    }

    private closeVoting(agendaItemId: number, agendaItemNumber: number) {
        this.votingService.closeVoting(this.meeting.MeetingId, agendaItemId)
        .subscribe((response: string) => {
            this.toastrService.success('Glasanje ' + agendaItemNumber + '. točke je zatvoreno!');
            this.votings.splice(this.votings.indexOf(agendaItemId), 1);
        }, (error: string) => {
            this.toastrService.error(error);
        })
    }

    private electronicLocal() {
        if (this.isToday()) {
            this.votingService.votings.subscribe(votings => {
                this.votings = votings;
            })

            this.refreshVoting();

            if (!this.authenticationService.isAdmin()) {
                this.interval = setInterval(() => {
                    console.log('interval');
                    this.refreshVoting();
                }, 3000);

                this.meeting.AgendaItems.forEach((item: any) => {
                    this.votes.push({
                        AgendaItemId: item.AgendaItemId,
                        Vote: undefined,
                        VoteId: undefined
                    });
                });

                this.voteService.readVotesByUser(this.meeting.MeetingId, this.authenticationService.user.UserId)
                .subscribe((response: any[]) => {
                    if (response.length > 0) {
                        response.forEach((el: any) => {
                            this.votes = this.votes.map((el2: any) => {
                                if (el.AgendaItemId === el2.AgendaItemId) {
                                    return el;
                                } else {
                                    return el2;
                                }
                            })
                        })
                    }
                }, (error: string) => {
                    this.toastrService.error(error);
                })
            }
        }
    }

    private findVote(agendaItemId: number): number {
        return this.votes.find((el: any) => el.AgendaItemId === agendaItemId).Vote;
    }

    private isOpened() {
        switch (this.meeting.TypeId) {
            case 3:
                let date = new Date(this.meeting.DateTime);
                let now = new Date();

                return now >= date;
        }
    }

    private isToday() {
        let date = new Date(this.meeting.DateTime);
        let now = new Date();

        return date.getDate() === now.getDate() &&  date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
    }

    private openVoting(agendaItemId: number, agendaItemNumber: number) {
        this.votingService.openVoting(this.meeting.MeetingId, agendaItemId)
        .subscribe((response: number[]) => {
            this.votings = response;
            this.toastrService.success('Glasanje ' + agendaItemNumber + '. točke je otvoreno!');
        }, (error: string) => {
            this.toastrService.error(error);
        })
    }

    private refreshVoting() {
        this.votingService.getVotings();
    }

    private vote(agendaItemId: number, vote: number) {
        if (this.findVote(agendaItemId) === undefined) {
            this.voteService.createVote(this.meeting.MeetingId, agendaItemId, this.authenticationService.user.UserId, vote)
            .subscribe((response: any) => {
                this.toastrService.success('Glasanje je spremljeno!');
                this.votes.forEach((voteEl: any) => {
                    if (voteEl.AgendaItemId === agendaItemId) {
                        voteEl.Vote = response.Vote;
                        voteEl.VoteId = response.VoteId;
                    }
                });
                console.log(this.votes);
            }, (error: string) => {
                this.toastrService.error(error);
            });
        } else {
            let voteId: number = this.votes.find((voteEl: any) => voteEl.AgendaItemId === agendaItemId).VoteId;

            this.voteService.updateVote(this.meeting.MeetingId, agendaItemId, voteId, this.authenticationService.user.UserId, vote)
            .subscribe((response: any) => {
                this.toastrService.success('Glasanje je spremljeno!');
                this.votes.forEach((voteEl: any) => {
                    if (voteEl.AgendaItemId === agendaItemId) {
                        voteEl.Vote = response.Vote;
                    }
                });
                console.log(this.votes);
            }, (error: string) => {
                this.toastrService.error(error);
            });
        }
    }

    private voteCummulative(formId: number, agendaItemId: number) {
        let newCummulativeVote: CummulativeVote = {
            AgendaItemId: undefined,
            VotesFor: this.votesFor[formId].value,
            VotesAbstain: this.votesAbstain[formId].value,
            VotesAgainst: this.votesAgainst[formId].value
        };

        this.cummulativeVoteService.createCummulativeVote(this.meeting.MeetingId, agendaItemId, newCummulativeVote)
        .subscribe((vote: CummulativeVote) => {
            this.toastrService.success('Glasovi su spremljeni!');

            let foundVote = this.cummulativeVoteResult.find(el => el.AgendaItemId === vote.AgendaItemId);
            foundVote.VotesAbstain = vote.VotesAbstain;
            foundVote.VotesAgainst = vote.VotesAgainst;
            foundVote.VotesFor = vote.VotesFor;
            this.voted[formId] = true;
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }
}
