import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { CouncilMembership } from '../../../shared/models/council-membership.model';
import { User } from '../../../shared/models/user.model';

@Injectable()
export class CouncilMembershipService {
    constructor (
        private authHttp: AuthHttp
    ) {}

    createCouncilMembership(userId: number, councilMembership: CouncilMembership): Observable<CouncilMembership> {
        return this.authHttp.post('/api/users/' + userId + '/councilMemberships', councilMembership)
        .map((response: Response) => <CouncilMembership>response.json())
        .catch(this.handleError);
    }

    private handleError (error: Response) {
        return Observable.throw(error.text());
    }
}
