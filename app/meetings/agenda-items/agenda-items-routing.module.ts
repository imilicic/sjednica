import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgendaItemCreateComponent } from './agenda-item-create/agenda-item-create.component';
import { AgendaItemUpdateComponent } from './agenda-item-update/agenda-item-update.component';
import { AgendaItemResolverService } from './shared/services/agenda-item-resolver.service';

const routes: Routes = [
    {
        path: 'create',
        component: AgendaItemCreateComponent
    },
    {
        path: 'update',
        component: AgendaItemUpdateComponent,
        resolve: {
            agendaItems: AgendaItemResolverService
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaItemsRoutingModule { }
