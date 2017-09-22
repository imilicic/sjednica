import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CummulativeVote } from '../../../shared/models/cummulative-vote.model';

@Injectable()
export class CummulativeVoteService {
    constructor(
        private authHttp: AuthHttp
    ) {}

    createCummulativeVote(meetingId: number, agendaItemId: number, votes: CummulativeVote): Observable<CummulativeVote> {
        return this.authHttp.post('/api/meetings/' + meetingId + '/agenda-items/' + agendaItemId + '/cummulative-vote', votes)
        .map((response: Response) => <CummulativeVote>response.json())
        .catch(this.handleError);
    }

    retrieveCummulativeVote(meetingId: number, agendaItemId: number): Observable<CummulativeVote> {
        return this.authHttp.get('/api/meetings/' + meetingId + '/agenda-items/' + agendaItemId + '/cummulative-vote')
        .map((response: Response) => <CummulativeVote>response.json())
        .catch(this.handleError);
    }

    updateCummulativeVote(meetingId: number, agendaItemId: number, voteId: number, votes: CummulativeVote): Observable<CummulativeVote> {
        return this.authHttp.put('api/meetings/' + meetingId + '/agenda-items/' + agendaItemId + 'cummulative-vote', votes)
        .map((response: Response) => <CummulativeVote>response.json())
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.text());
    }
}
