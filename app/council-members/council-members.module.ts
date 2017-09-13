import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { CouncilMemberComponent } from './council-member/council-member.component';
import { CouncilMemberCreateComponent } from './council-member-create/council-member-create.component';
import { CouncilMemberResolverService } from './shared/services/council-member-resolver.service';
import { CouncilMemberService } from './shared/services/council-member.service';
import { CouncilMemberUpdateComponent } from './council-member-update/council-member-update.component';
import { CouncilMembersComponent } from './council-members.component';
import { CouncilMembersRoutingModule } from './council-members-routing.module';
import { UserService } from './shared/services/user.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
      tokenName: 'auth_token',
          tokenGetter: (() => localStorage.getItem('auth_token')),
          globalHeaders: [{'Content-Type': 'application/json'}],
      }), http, options);
  }

@NgModule({
    declarations: [
        CouncilMemberComponent,
        CouncilMemberCreateComponent,
        CouncilMemberUpdateComponent,
        CouncilMembersComponent
    ],
    imports: [
        CommonModule,
        CouncilMembersRoutingModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        RouterModule
    ],
    providers: [
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        },
        CouncilMemberResolverService,
        CouncilMemberService,
        UserService
    ]
})
export class CouncilMembersModule {}
