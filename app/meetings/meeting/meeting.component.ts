import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AgendaItem } from '../../shared/models/agenda-item.model';
import { AgendaItemService } from '../agenda-items/shared/services/agenda-item.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { CummulativeVote } from '../../shared/models/cummulative-vote.model';
import { CummulativeVoteService } from '../shared/services/cummulative-vote.service';
import { DocumentService } from '../agenda-items/shared/services/document.service';
import { Meeting } from '../../shared/models/meeting.model';
import { MeetingService } from '../shared/services/meeting.service';
import { VoteService } from '../shared/services/vote.service';
import { VotingService } from '../shared/services/voting.service';
import { ToastrService } from '../../shared/services/toastr.service';
import { TypeService } from '../../shared/services/type.service';

@Component({
    templateUrl: './meeting.component.html'
})

export class MeetingComponent implements OnInit {
    private documents: any[];
    private interval: any;
    private meeting: Meeting;
    private notifications: any[];
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
        private documentService: DocumentService,
        private meetingService: MeetingService,
        private toastrService: ToastrService,
        private typeService: TypeService,
        private voteService: VoteService,
        private votingService: VotingService
    ) { }

    ngOnDestroy() {
        clearInterval(this.interval);
    }

    ngOnInit() {
        this.meeting = this.activatedRoute.snapshot.data['meeting'];
        this.meeting.AgendaItems = this.activatedRoute.snapshot.data['agendaItems'];
        this.notifications = this.activatedRoute.snapshot.data['notifications'];

        this.meeting.AgendaItems.forEach((agendaItem: AgendaItem) => {
            this.meeting.AgendaItems.find(item => item.AgendaItemId === agendaItem.AgendaItemId).Documents = [];

            this.documentService.retrieveDocuments(this.meeting.MeetingId, agendaItem.AgendaItemId)
            .subscribe((documents: any[]) => {
                this.meeting.AgendaItems.find(item => item.AgendaItemId === agendaItem.AgendaItemId).Documents  = documents;
            });
        });

        this.votes = [];
        this.votings = [];

        if (this.isOpened()) {
            switch (this.meeting.TypeId) {
                case 1:
                this.electronicRemote();
                break;

                case 2:
                // electronic locally
                this.electronicLocal();
                break;

                case 3:
                // non-electronic
                this.buildForm();
                break;
            }
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

    // private checkQuorum() {
    //     this.meetingService.retrievePresenceCount()
    // }

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
        this.votingService.votings.subscribe(votings => {
            this.votings = votings;
        });

        this.refreshVoting();

        this.interval = setInterval(() => {
            this.refreshVoting();
        }, 3000);

        this.meeting.AgendaItems.forEach((item: any) => {
            this.votes.push({
                AgendaItemId: item.AgendaItemId,
                Vote: undefined,
                VoteId: undefined
            });
        });

        this.voteService.retrieveVotesByUser(this.meeting.MeetingId)
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
        });
    }

    private electronicRemote() {
        if (!this.isToday()) {
            return;
        }

        this.meetingService.createPresenceUser(this.meeting.MeetingId).subscribe();

        this.meeting.AgendaItems.forEach((item: any) => {
            this.votes.push({
                AgendaItemId: item.AgendaItemId,
                Vote: undefined,
                VoteId: undefined
            });
        });

        this.voteService.retrieveVotesByUser(this.meeting.MeetingId)
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
        });
    }

    private findVote(agendaItemId: number): number {
        return this.votes.find((el: any) => el.AgendaItemId === agendaItemId).Vote;
    }

    private isOpened() {
        switch (this.meeting.TypeId) {
            case 1:
            return this.isToday();

            case 2:
            case 3:
            let date = new Date(this.meeting.DateTime);
            let now = new Date();

            return this.isToday() && this.isPassed();
        }
    }

    private isPassed() {
        let date = new Date(this.meeting.DateTime);
        let now = new Date();

        return now >= date;
    }

    private isToday() {
        let date = new Date(this.meeting.DateTime);
        let now = new Date();

        return date.getDate() === now.getDate() &&  date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    }

    private openVoting(agendaItemId: number, agendaItemNumber: number) {
        this.votingService.openVoting(this.meeting.MeetingId, agendaItemId)
        .subscribe((response: any) => {
            this.votings.push(response);
            this.toastrService.success('Glasanje ' + agendaItemNumber + '. točke je otvoreno!');
        }, (error: string) => {
            this.toastrService.error(error);
        })
    }

    private refreshVoting() {
        this.votingService.getVotings(this.meeting.MeetingId);
    }

    private vote(agendaItemId: number, vote: number) {
        if (this.findVote(agendaItemId) === undefined) {
            this.voteService.createVote(this.meeting.MeetingId, agendaItemId, vote)
            .subscribe((response: any) => {
                this.toastrService.success('Glasanje je spremljeno!');
                this.votes.forEach((voteEl: any) => {
                    if (voteEl.AgendaItemId === agendaItemId) {
                        voteEl.Vote = response.Vote;
                        voteEl.VoteId = response.VoteId;
                    }
                });
            }, (error: string) => {
                this.toastrService.error(error);
            });
        } else {
            let voteId: number = this.votes.find((voteEl: any) => voteEl.AgendaItemId === agendaItemId).VoteId;

            this.voteService.replaceVote(this.meeting.MeetingId, agendaItemId, voteId, vote)
            .subscribe((response: any) => {
                this.toastrService.success('Glasanje je spremljeno!');
                this.votes.forEach((voteEl: any) => {
                    if (voteEl.AgendaItemId === agendaItemId) {
                        voteEl.Vote = response.Vote;
                    }
                });
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
