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

    createVote(meetingId: number, agendaItemId: number, userId: number, vote: number) {
        let newVote: any = {
            Vote: vote,
            UserId: userId
        };

        return this.authHttp.post('/api/meetings/' + meetingId + '/agenda/items/' + agendaItemId + '/votes', newVote)
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    readVotesByUser(meetingId: number, userId: number): Observable<any[]> {
        return this.authHttp.get('/api/meetings/' + meetingId + '/agenda/votes/' + userId)
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

    updateVote(meetingId: number, agendaItemId: number, voteId: number, userId: number, vote: number) {
        let newVote: any = {
            Vote: vote,
            UserId: userId
        };

        return this.authHttp.put('/api/meetings/' + meetingId + '/agenda/items/' + agendaItemId + '/votes/' + voteId, newVote)
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.text());
    }
}
