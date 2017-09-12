import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AgendaItemService } from './agenda-item.service';
import { AgendaItem } from '../../../../shared/models/agenda-item.model';

@Injectable()
export class AgendaItemResolverService implements Resolve<AgendaItem[]> {
    constructor(
        private agendaItemService: AgendaItemService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<AgendaItem[]> {
        let agendaItems =  this.agendaItemService.retrieveAgendaItems(route.params['meetingId']);
        agendaItems.subscribe((_: AgendaItem[]) => {
            return true;
        }, (error: string) => {
            this.router.navigate(['meetings']);
        });

        return agendaItems;
    }
}
