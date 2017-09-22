import { Injectable } from '@angular/core';
import { Response } from '@angular/http'
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DocumentService {
    constructor(
        private authHttp: AuthHttp
    ) {}

    createDocument(meetingId: number, agendaItemId: number, document: any): Observable<any> {
        return this.authHttp.post('/api/meetings/' + meetingId + '/agenda-items/' + agendaItemId + '/documents', document)
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    retrieveDocuments(meetingId: number, agendaItemId: number): Observable<any[]> {
        return this.authHttp.get('/api/meetings/' + meetingId + '/agenda-items/' + agendaItemId + '/documents')
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    retrieveDocument(meetingId: number, agendaItemId: number, documentId: number): Observable<any> {
        return this.authHttp.get('/api/meetings/' + meetingId + '/agenda-items/' + agendaItemId + '/documents/' + documentId)
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    replaceDocument(meetingId: number, agendaItemId: number, documentId: number, document: any): Observable<any> {
        return this.authHttp.put('/api/meetings/' + meetingId + '/agenda-items/' + agendaItemId + '/documents/' + documentId, document)
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.text());
    }
}
