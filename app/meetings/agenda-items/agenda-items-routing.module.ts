import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgendaItemCreateComponent } from './agenda-item-create/agenda-item-create.component';
import { AgendaItemUpdateComponent } from './agenda-item-update/agenda-item-update.component';
import { AgendaItemResolverService } from './shared/services/agenda-item-resolver.service';
import { DocumentCreateComponent } from './document-create/document-create.component';
import { DocumentResolverService } from './shared/services/document-resolver.service';
import { DocumentUpdateComponent } from './document-update/document-update.component';

const routes: Routes = [
    {
        path: 'create',
        component: AgendaItemCreateComponent,
        resolve: {
            agendaItems: AgendaItemResolverService
        }
    },
    {
        path: 'update',
        component: AgendaItemUpdateComponent,
        resolve: {
            agendaItems: AgendaItemResolverService
        }
    },
    {
        path: ':agendaItemId/documents/create',
        component: DocumentCreateComponent
    },
    {
        path: ':agendaItemId/documents/update',
        component: DocumentUpdateComponent,
        resolve: {
            documents: DocumentResolverService
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaItemsRoutingModule { }
