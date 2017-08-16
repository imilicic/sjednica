import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { MeetingResolverService } from './meeting/meeting-resolver.service';
import { MeetingComponent } from './meeting/meeting.component';
import { MeetingService } from './shared/services/meeting.service';
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
        MeetingsComponent,
        MeetingTypePipe
    ],
    providers: [
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        },
        MeetingResolverService,
        MeetingService
    ],
})
export class MeetingsModule { }
