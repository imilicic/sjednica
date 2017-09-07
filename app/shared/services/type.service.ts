import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Type } from '../models/type.model';
import { ToastrService } from './toastr.service';

@Injectable()
export class TypeService {
    types: Type[] = [];

    constructor(
        private authHttp: AuthHttp,
        private toastrService: ToastrService
    ) {
        this.retrieveTypes().subscribe((types: Type[]) => {
            this.types = types;
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }

    retrieveTypes(): Observable<Type[]> {
        return this.authHttp.get('/api/types')
            .map((response: Response) => <Type[]>response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error.text());
        return Observable.throw(error.text());
    }
}
