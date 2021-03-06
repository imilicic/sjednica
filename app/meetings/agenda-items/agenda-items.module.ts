import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AgendaItemCreateComponent } from './agenda-item-create/agenda-item-create.component';
import { AgendaItemResolverService } from './shared/services/agenda-item-resolver.service';
import { AgendaItemService } from './shared/services/agenda-item.service';
import { AgendaItemUpdateComponent } from './agenda-item-update/agenda-item-update.component';
import { AgendaItemsRoutingModule } from './agenda-items-routing.module';
import { DocumentCreateComponent } from './document-create/document-create.component';
import { DocumentResolverService } from './shared/services/document-resolver.service';
import { DocumentService } from './shared/services/document.service';
import { DocumentUpdateComponent } from './document-update/document-update.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
      tokenName: 'auth_token',
          tokenGetter: (() => localStorage.getItem('auth_token')),
          globalHeaders: [{'Content-Type': 'application/json'}],
      }), http, options);
  }

@NgModule({
    imports: [
        AgendaItemsRoutingModule,
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [],
    declarations: [
        AgendaItemCreateComponent,
        AgendaItemUpdateComponent,
        DocumentCreateComponent,
        DocumentUpdateComponent
    ],
    providers: [
        AgendaItemResolverService,
        AgendaItemService,
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        },
        DocumentResolverService,
        DocumentService
    ]
})
export class AgendaItemsModule { }
