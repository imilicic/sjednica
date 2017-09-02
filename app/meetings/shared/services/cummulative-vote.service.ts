import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Observable/throw'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CummulativeVoteService {
    constructor(
        private authHttp: AuthHttp
    ) {}

    createCummulativeVote(meetingId: number, agendaItemId: number, votes: any) {
        return this.authHttp.post('/api/meetings/' + meetingId + '/agenda/items/' + agendaItemId + '/cummulative-votes', votes)
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    updateCummulativeVote(meetingId: number, agendaItemId: number, voteId: number, votes: any) {
        return this.authHttp.put('api/meetings/' + meetingId + '/agenda/items/' + agendaItemId + 'cummulative-votes/' + voteId, votes)
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.text());
    }
}
