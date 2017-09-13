import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { CouncilMember } from '../../../shared/models/council-member.model';

@Injectable()
export class CouncilMemberService {
    constructor(
        private authHttp: AuthHttp
    ) {}

    createCouncilMember(councilMember: any): Observable<CouncilMember> {
        return this.authHttp.post('/api/council-members', councilMember)
        .map((response: Response) => <CouncilMember>response.json())
        .catch(this.handleError);
    }

    replaceCouncilMember(councilMemberId: number, councilMember: any): Observable<CouncilMember> {
        return this.authHttp.put('/api/council-members/' + councilMemberId, councilMember)
        .map((response: Response) => <CouncilMember>response.json())
        .catch(this.handleError);
    }

    retrieveCouncilMember(councilMemberId: number): Observable<CouncilMember> {
        return this.authHttp.get('/api/council-members/' + councilMemberId)
        .map((response: Response) => <CouncilMember>response.json())
        .catch(this.handleError);
    }

    retrieveCouncilMembers(): Observable<CouncilMember[]> {
        return this.authHttp.get('/api/council-members')
        .map((response: Response) => <CouncilMember[]>response.json())
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.text());
    }
}
