import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class VotingService {
    public votings: BehaviorSubject<number[]> = new BehaviorSubject([]);

    closeVoting(meetingId: number, agendaItemId: number): Observable<string> {
        return this.authHttp.delete('/api/meetings/' + meetingId + '/votings/' + agendaItemId)
        .map((response: Response) => response.text())
        .catch(this.handleError);
    }

    constructor(
        private authHttp: AuthHttp
    ) {}

    getVotings() {
        this.authHttp.get('/api/meetings/' + 1 + '/votings')
        .map((response: Response) => <number[]>response.json())
        .do((voting: number[]) => {
            this.votings.next(voting);
        }).catch(this.handleError).subscribe();
    }

    openVoting(meetingId: number, agendaItemId: number): Observable<number[]> {
        return this.authHttp.post('/api/meetings/' + meetingId + '/votings', {AgendaItemId: agendaItemId})
        .map((response: Response) => <number[]>response.json())
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.text);
    }
}
