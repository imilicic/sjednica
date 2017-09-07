import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { CouncilMembershipsComponent } from './council-memberships.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
      tokenName: 'auth_token',
          tokenGetter: (() => localStorage.getItem('auth_token')),
          globalHeaders: [{'Content-Type': 'application/json'}],
      }), http, options);
  }

@NgModule({
    declarations: [
        CouncilMembershipsComponent
    ],
    imports: [
        CommonModule,
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
    ]
})
export class CouncilMembershipsModule {}
