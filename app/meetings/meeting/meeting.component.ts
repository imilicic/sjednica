import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VoteService } from '../shared/services/vote.service';
import { VotingService } from '../shared/services/voting.service';
import { Meeting } from '../../shared/models/meeting.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { ToastrService } from '../../shared/services/toastr.service';

@Component({
    templateUrl: './meeting.component.html'
})

export class MeetingComponent implements OnInit {
    private interval: any;
    private meeting: Meeting;
    private votes: any;
    private votings: number[];

    constructor(
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private toastrService: ToastrService,
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
        this.votes = [];
        this.votings = [];

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

    private closeVoting(agendaItemId: number, agendaItemNumber: number) {
        this.votingService.closeVoting(this.meeting.MeetingId, agendaItemId)
        .subscribe((response: string) => {
            this.toastrService.success('Glasanje ' + agendaItemNumber + '. točke je zatvoreno!');
            this.votings.splice(this.votings.indexOf(agendaItemId), 1);
        }, (error: string) => {
            this.toastrService.error(error);
        })
    }

    private findVote(agendaItemId: number): number {
        return this.votes.find((el: any) => el.AgendaItemId === agendaItemId).Vote;
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
}
