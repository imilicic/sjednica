import { Injectable } from '@angular/core';
import { Response } from '@angular/http'
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AgendaItem } from '../../../shared/models/agenda-item.model';

@Injectable()
export class AgendaItemService {
    constructor(
        private authHttp: AuthHttp
    ) {}

    createAgendaItem(meetingId: number, agendaItem: AgendaItem): Observable<AgendaItem> {
        let url = '/api/meetings/' +
        meetingId +
        '/agenda-items';

        return this.authHttp.post(url, agendaItem)
        .map((response: Response) => <AgendaItem>response.json())
        .catch(this.handleError);
    }

    retrieveAgendaItems(meetingId: number): Observable<AgendaItem[]> {
        let url = '/api/meetings/' +
        meetingId +
        '/agenda-items';

        return this.authHttp.get(url)
            .map((response: Response) => <AgendaItem[]>response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.text());
    }
}
