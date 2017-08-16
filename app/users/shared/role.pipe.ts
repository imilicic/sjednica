import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'role'
})
export class RolePipe implements PipeTransform {
    transform(value: string): string {
        switch (value) {
            case 'admin':
                return 'administrator';
            case 'councilmember':
                return 'član vijeća';
            case 'user':
                return 'korisnik';
        }
    }
}
