import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Role } from '../models/role.model';
import { ToastrService } from './toastr.service';

@Injectable()
export class RoleService {
    roles: Role[] = [];

    constructor(
        private authHttp: AuthHttp,
        private toastrService: ToastrService
    ) {
        this.retrieveRoles().subscribe((roles: Role[]) => {
            this.roles = roles;
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }

    retrieveRoles(): Observable<Role[]> {
        return this.authHttp.get('/api/roles')
            .map((response: Response) => <Role[]>response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error.text());
        return Observable.throw(error.text());
    }
}
