import { Injectable } from "@angular/core";

@Injectable()
export class ResponseMessagesService {
    private responseMessage: string = "";
    private generalMessages = {
        "required": "Polje je obavezno!"
    }
    private responseMessages = {
        "login": {
            "user-not-found": "Korisnik ne postoji!",
            "wrong-password": "Kriva lozinka!",
            "successful": "",

            "required": this.generalMessages.required
        },
        "users/me": {
            "wrong-old-password": "Stara lozinka je kriva!",
            "unsuccessful": "Lozinka nije promijenjena!",
            "successful": "",

            "required": this.generalMessages.required,
            "new-password-minlength": "Barem 8 znakova!",
            "new-password-pattern": "Barem jedno slovo i jedan broj!",
            "new-password2-required": "Polje je obavezno!",
            "new-passwords-not-equal": "Lozinke nisu jednake!",

            "password-changed": "Vaša lozinka je uspješno promijenjena!"
        }
    };

    setResponseMessage(responseCode: { location: string, code: string }) {
        this.responseMessage = this.responseMessages[responseCode.location][responseCode.code];
        return this.responseMessage;
    }

    getResponseMessage() {
        return this.responseMessage;
    }

    getMessage(responseCode: { location: string, code: string }) {
        return this.responseMessages[responseCode.location][responseCode.code];
    }
}