import { Injectable } from '@angular/core';

@Injectable()
export class ResponseMessagesService {
    private generalMessages = {
        'required': 'Polje je obavezno!'
    }
    private responseMessages = {
        'users/create': {
            'required': this.generalMessages.required,
            'invalid-email': 'Neispravan e-mail!',
            'invalid-phone-number': 'Neispravan format! (Primjer ispravnog broja: 032 123456)',
            'invalid-date': 'Datum nije valjan!',
            'invalid-year': 'Upišite godinu između 1900 i 9999!',
            'start-date-before-end-date': 'Završni datum mora biti nakon početnog!',
            'now-not-between-start-end': 'Trenutno vrijeme nije između početnog i završnog!'
        },
        'users/update': {
            'required': this.generalMessages.required,
            'invalid-email': 'Neispravan e-mail!',
            'invalid-phone-number': 'Neispravan format! (Primjer ispravnog broja: 032 123456)',
            'invalid-date': 'Datum nije valjan!',
            'invalid-year': 'Upišite godinu između 1900 i 9999!',
            'start-date-before-end-date': 'Završni datum mora biti nakon početnog!',
            'now-not-between-start-end': 'Trenutno vrijeme nije između početnog i završnog!'
        },
        'login': {
            'required': this.generalMessages.required
        },
        'users/update/me': {
            'required': this.generalMessages.required,
            'new-password-minlength': 'Barem 8 znakova!',
            'new-password-pattern': 'Barem jedno slovo i jedan broj!',
            'new-passwords-not-equal': 'Lozinke nisu jednake!',
        }
    };

    getMessage(responseCode: { location: string, code: string }): string {
        return this.responseMessages[responseCode.location][responseCode.code];
    }
}
