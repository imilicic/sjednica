import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgendaItemCreateComponent } from './agenda-items/agenda-item-create/agenda-item-create.component';
import { MeetingComponent } from './meeting/meeting.component';
import { MeetingCreateComponent } from './meeting-create/meeting-create.component';
import { MeetingsComponent } from './meetings.component';
import { MeetingVotesComponent } from './meeting-votes/meeting-votes.component';
import { AgendaItemResolverService } from './shared/services/agenda-item-resolver.service';
import { MeetingResolverService } from './shared/services/meeting-resolver.service';
import { AdminRouteActivatorService } from '../shared/services/admin-route-activator.service';

const routes: Routes = [
    {
        path: '',
        component:
        MeetingsComponent
    },
    {
        path: 'create',
        component: MeetingCreateComponent,
        canActivate: [
            AdminRouteActivatorService
        ]
    },
    {
        path: ':meetingId',
        component: MeetingComponent,
        resolve: {
            meeting: MeetingResolverService,
            agendaItems: AgendaItemResolverService
        }
    },
    {
        path: ':meetingId/votes',
        component: MeetingVotesComponent,
        resolve: {
            meeting: MeetingResolverService,
            agendaItems: AgendaItemResolverService
        }
    },
    {
        path: ':meetingId/agenda-items/create',
        component: AgendaItemCreateComponent,
        resolve: {
            meeting: MeetingResolverService,
            agendaItems: AgendaItemResolverService
        },
        canActivate: [
            AdminRouteActivatorService
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MeetingsRoutingModule { }
