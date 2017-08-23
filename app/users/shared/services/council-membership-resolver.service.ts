import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CouncilMembership } from '../../../shared/models/council-membership.model';
import { CouncilMembershipService } from './council-membership.service';

@Injectable()
export class CouncilMembershipResolverService implements Resolve<CouncilMembership> {
    constructor(
        private councilMembershipService: CouncilMembershipService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<CouncilMembership> {
        let councilMemberships = this.councilMembershipService.getCouncilMemberships(route.params['userId']);

        councilMemberships.subscribe((_: CouncilMembership) => {
            return true;
        }, (error: string) => {
            this.router.navigate(['users']);
        });

        return councilMemberships;
    }
}
