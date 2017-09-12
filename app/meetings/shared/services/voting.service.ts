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
        return this.authHttp.delete('/api/meetings/' + meetingId + '/agenda-items/' + agendaItemId + '/voting')
        .map((response: Response) => response.text())
        .catch(this.handleError);
    }

    constructor(
        private authHttp: AuthHttp
    ) {}

    getVotings(meetingId: number) {
        this.authHttp.get('/api/meetings/' + meetingId + '/agenda-items/votings')
        .map((response: Response) => <any[]>response.json())
        .do((voting: any[]) => {
            this.votings.next(voting.map(el => el.AgendaItemId));
        }).catch(this.handleError)
        .subscribe();
    }

    openVoting(meetingId: number, agendaItemId: number): Observable<any> {
        return this.authHttp.post('/api/meetings/' + meetingId + '/agenda-items/' + agendaItemId + '/voting', {})
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.text());
    }
}
