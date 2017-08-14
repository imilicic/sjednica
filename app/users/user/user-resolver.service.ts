import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { User } from '../../shared/models/user.model';
import { UserService } from '../shared/services/user.service';

@Injectable()
export class UserResolverService implements Resolve<User> {
    constructor(
        private router: Router,
        private userService: UserService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        let user = this.userService.getUser(route.params['userId']);
        user.subscribe((_: User) => {
            return true;
        }, (error: string) => {
            this.router.navigate(['users']);
        });

        return user;
    }
}
