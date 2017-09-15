import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DocumentService } from './document.service';

@Injectable()
export class DocumentResolverService implements Resolve<any[]> {
    constructor(
        private documentService: DocumentService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any[]> {
        let documents =  this.documentService.retrieveDocuments(route.params['meetingId'], route.params['agendaItemId']);
        documents.subscribe((_: any[]) => {
            return true;
        }, (error: string) => {
            this.router.navigate(['meetings']);
        });

        return documents;
    }
}
