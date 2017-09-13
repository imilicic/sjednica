import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CouncilMember } from '../../../shared/models/council-member.model';
import { CouncilMemberService } from './council-member.service';

@Injectable()
export class CouncilMemberResolverService implements Resolve<CouncilMember> {
    constructor(
        private councilMemberService: CouncilMemberService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<CouncilMember> {
        let councilMember = this.councilMemberService.retrieveCouncilMember(route.params['councilMemberId']);

        councilMember.subscribe((_: any) => true, (error: string) => {
            this.router.navigate(['council-members']);
        })

        return councilMember;
    }
}
