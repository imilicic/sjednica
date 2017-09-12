import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminRouteActivatorService } from '../shared/services/admin-route-activator.service';
import { AgendaItemResolverService } from './agenda-items/shared/services/agenda-item-resolver.service';
import { MeetingAbsenceComponent } from './meeting-absence/meeting-absence.component';
import { MeetingComponent } from './meeting/meeting.component';
import { MeetingCreateComponent } from './meeting-create/meeting-create.component';
import { MeetingPresenceComponent } from './meeting-presence/meeting-presence.component';
import { MeetingResolverService } from './shared/services/meeting-resolver.service';
import { MeetingUpdateComponent } from './meeting-update/meeting-update.component';
import { MeetingVotesComponent } from './meeting-votes/meeting-votes.component';
import { MeetingsComponent } from './meetings.component';

const routes: Routes = [
    {
        path: '',
        component: MeetingsComponent
    },
    {
        path: 'create',
        component: MeetingCreateComponent,
        canActivate: [
            AdminRouteActivatorService
        ]
    },
    {
        path: 'update/:meetingId',
        component: MeetingUpdateComponent,
        resolve: {
            meeting: MeetingResolverService
        },
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
        path: ':meetingId/presence',
        component: MeetingPresenceComponent,
        canActivate: [
            AdminRouteActivatorService
        ],
        resolve: {
            meeting: MeetingResolverService
        }
    },
    {
        path: ':meetingId/absence',
        component: MeetingAbsenceComponent,
        canActivate: [
            AdminRouteActivatorService
        ],
        resolve: {
            meeting: MeetingResolverService
        }
    },
    {
        path: ':meetingId/agenda-items',
        loadChildren: 'app/meetings/agenda-items/agenda-items.module#AgendaItemsModule',
        resolve: {
            meeting: MeetingResolverService
        },
        canActivate: [
            AdminRouteActivatorService
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MeetingsRoutingModule { }
