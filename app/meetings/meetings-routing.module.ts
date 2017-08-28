import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeetingComponent } from './meeting/meeting.component';
import { MeetingCreateComponent } from './meeting-create/meeting-create.component';
import { MeetingsComponent } from './meetings.component';
import { MeetingVotesComponent } from './meeting-votes/meeting-votes.component';
import { MeetingResolverService } from './shared/services/meeting-resolver.service';

const routes: Routes = [
    {
        path: '',
        component:
        MeetingsComponent
    },
    {
        path: 'create',
        component: MeetingCreateComponent
    },
    {
        path: ':meetingId',
        component: MeetingComponent,
        resolve: {
            meeting: MeetingResolverService
        }
    },
    {
        path: ':meetingId/votes',
        component: MeetingVotesComponent,
        resolve: {
            meeting: MeetingResolverService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MeetingsRoutingModule { }
