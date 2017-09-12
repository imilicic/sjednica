import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AgendaItemResolverService } from './agenda-items/shared/services/agenda-item-resolver.service';
import { AgendaItemService } from './agenda-items/shared/services/agenda-item.service';
import { CummulativeVoteService } from './shared/services/cummulative-vote.service';
import { MeetingAbsenceComponent } from './meeting-absence/meeting-absence.component';
import { MeetingComponent } from './meeting/meeting.component';
import { MeetingCreateComponent } from './meeting-create/meeting-create.component';
import { MeetingPresenceComponent } from './meeting-presence/meeting-presence.component';
import { MeetingResolverService } from './shared/services/meeting-resolver.service';
import { MeetingService } from './shared/services/meeting.service';
import { MeetingTypePipe } from './shared/meeting-type.pipe';
import { MeetingUpdateComponent } from './meeting-update/meeting-update.component';
import { MeetingVotesComponent } from './meeting-votes/meeting-votes.component';
import { MeetingsComponent } from './meetings.component';
import { MeetingsRoutingModule } from './meetings-routing.module';
import { VoteService } from './shared/services/vote.service';
import { VotingService } from './shared/services/voting.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'auth_token',
        tokenGetter: (() => localStorage.getItem('auth_token')),
        globalHeaders: [{'Content-Type': 'application/json'}],
    }), http, options);
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        MeetingsRoutingModule,
        ReactiveFormsModule
    ],
    exports: [],
    declarations: [
        MeetingAbsenceComponent,
        MeetingComponent,
        MeetingCreateComponent,
        MeetingPresenceComponent,
        MeetingTypePipe,
        MeetingUpdateComponent,
        MeetingVotesComponent,
        MeetingsComponent
    ],
    providers: [
        AgendaItemResolverService,
        AgendaItemService,
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        },
        CummulativeVoteService,
        MeetingResolverService,
        MeetingService,
        VoteService,
        VotingService
    ],
})
export class MeetingsModule { }
