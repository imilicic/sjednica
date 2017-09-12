import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable} from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/Observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { CummulativeVote } from '../../../shared/models/cummulative-vote.model';

@Injectable()
export class VoteService {
    constructor(
        private authHttp: AuthHttp
    ) {}

    createVote(meetingId: number, agendaItemId: number, vote: number) {
        let newVote: any = {
            Vote: vote
        };

        return this.authHttp.post('/api/meetings/' + meetingId + '/agenda-items/' + agendaItemId + '/votes', newVote)
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    retrieveVotesByUser(meetingId: number): Observable<any[]> {
        return this.authHttp.get('/api/meetings/' + meetingId + '/agenda-items/votes/')
        .map((response: Response) => <any[]>response.json())
        .catch(this.handleError);
    }

    retrieveCummulativeVote(meetingId: number, agendaItemId: number): Observable<CummulativeVote> {
        let url = '/api/meetings/' +
        meetingId +
        '/agenda-items/' +
        agendaItemId +
        '/cummulative-vote';

        return this.authHttp.get(url)
        .map((response: Response) => {
            let cummulativeVote = <CummulativeVote>response.json();
            cummulativeVote.AgendaItemId = +cummulativeVote.AgendaItemId;
            return cummulativeVote;
        })
        .catch(this.handleError);
    }

    retrieveVotes(meetingId: number, agendaItemId: number): Observable<any[]> {
        let url = '/api/meetings/' +
        meetingId +
        '/agenda-items/' +
        agendaItemId +
        '/votes';

        return this.authHttp.get(url)
        .map((response: Response) => <any[]>response.json())
        .catch(this.handleError);
    }

    replaceVote(meetingId: number, agendaItemId: number, voteId: number, vote: number) {
        let newVote: any = {
            Vote: vote
        };

        return this.authHttp.put('/api/meetings/' + meetingId + '/agenda-items/' + agendaItemId + '/votes/' + voteId, newVote)
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.text());
    }
}
