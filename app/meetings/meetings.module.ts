import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { MeetingComponent } from './meeting/meeting.component';
import { MeetingCreateComponent } from './meeting-create/meeting-create.component';
import { MeetingVotesComponent } from './meeting-votes/meeting-votes.component';
import { CummulativeVoteService } from './shared/services/cummulative-vote.service';
import { MeetingService } from './shared/services/meeting.service';
import { MeetingResolverService } from './shared/services/meeting-resolver.service';
import { VoteService } from './shared/services/vote.service';
import { VotingService } from './shared/services/voting.service';
import { MeetingTypePipe } from './shared/meeting-type.pipe';
import { MeetingsRoutingModule } from './meetings-routing.module';
import { MeetingsComponent } from './meetings.component';

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
        HttpModule,
        MeetingsRoutingModule
    ],
    exports: [],
    declarations: [
        MeetingComponent,
        MeetingCreateComponent,
        MeetingsComponent,
        MeetingTypePipe,
        MeetingVotesComponent
    ],
    providers: [
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
