import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { ResponseMessagesService } from "../../shared/providers/response-messages.service";
import { ToastrService } from "../../shared/providers/toastr.service";
import { UserService } from "../../shared/providers/user.service";

@Component({
    styleUrls: ["app/users/profile/user-profile.component.css"],
    templateUrl: "app/users/profile/user-profile.component.html"
})
export class UserProfileComponent implements OnInit{
    changePasswordMode: boolean = false;
    generatedPassword: boolean = false;

    newPassword: FormControl;
    newPassword2: FormControl;
    oldPassword: FormControl;
    passwordForm: FormGroup;

    constructor(
        private responseMessagesService: ResponseMessagesService,
        private router: Router,
        private toastrService: ToastrService,
        private userService: UserService
    ) {}

    changePassword(formValues: any) {
        this.userService.changePassword({ 
            newPassword: formValues.newPassword,
            oldPassword: formValues.oldPassword
        }).subscribe((response: string) => {
            this.toastrService.success(response);
            this.passwordForm.reset();
            this.changePasswordMode = false;
        }, (error: any) => {
            this.toastrService.error(error);
            this.passwordForm.reset();
        });
    }

    ngOnInit() {
        this.newPassword = new FormControl("", [Validators.required, Validators.minLength(8), Validators.pattern(/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]*)$/)]);
        this.newPassword2 = new FormControl("", Validators.required);
        this.oldPassword = new FormControl("", Validators.required);

        this.passwordForm = new FormGroup({
            newPassword: this.newPassword,
            newPassword2: this.newPassword2,
            oldPassword: this.oldPassword
        });
        this.passwordForm.setValidators([areNewPasswordsEqual()]);
    }

    setPassword() {
        this.generatedPassword = !this.generatedPassword;

        if(this.generatedPassword) {
            let password = this.generatePassword(8, 4, 2);

            this.newPassword.setValue(password);
            this.newPassword2.setValue(password);
            this.newPassword.markAsTouched();
            this.newPassword2.markAsTouched();
        } else {
            this.newPassword.reset();
            this.newPassword2.reset();
        }
    }
    
    getWarningMessage(code: string) {
        return this.responseMessagesService.getMessage({
            location: "users/me",
            code: code
        });
    }

    /**
     * generates a password of given length
     * @function
     * @param length length of password
     * @param minLetters minimum number of letters in password (case insensitive)
     * @param minNumbers minimum number of numbers in password
     */
    private generatePassword(length: number, minLetters: number, minNumbers: number) {
        let letters = "abcdefghijklmnpqrstuvwxyz";
        let numbers = "123456789";
        let characters;

        let password = [];
        let chosen = "";

        // fill password with letters
        for(let i = 0; i < minLetters; i++) {
            chosen = letters[Math.floor(Math.random()*(letters.length-1))];
            letters = letters.split(chosen).join(""); // deletes chosen letter

            if ((Math.random() < 0.5 || chosen == "i" || chosen == "o") && chosen != "l") {
                password.push(chosen);
            } else {
                password.push(chosen.toLocaleUpperCase());
            }
        }

        // fill password with numbers
        for(let i = 0; i < minNumbers; i++) {
            chosen = numbers[Math.floor(Math.random()*(numbers.length-1))];
            numbers = numbers.split(chosen).join(""); // deletes chosen number

            password.push(chosen);
        }
    
        // fill the rest of password with any characters
        characters = letters + numbers;
        for(let i = password.length; i < length; i++) {
            chosen = characters[Math.floor(Math.random()*(characters.length-1))]
            characters = characters.split(chosen).join(""); // deletes chosen number

            if ((Math.random() < 0.5 || chosen == "i" || chosen == "o") && chosen != "l") {
                password.push(chosen);
            } else {
                password.push(chosen.toLocaleUpperCase());
            }
        }

        return this.shuffleArray(password).join("");        
    }

    /**
     * returns a random permutation of a given array
     * @function
     * @param array array of things to be shuffled
     */
    private shuffleArray(array: any[]) {
        let currentIndex = array.length;
        let temporaryValue;
        let randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}

function areNewPasswordsEqual() {
    return (formGroup: FormGroup) => {
        let newPassword = formGroup.controls["newPassword"].value;
        let newPassword2 = formGroup.controls["newPassword2"].value;

        if (newPassword != newPassword2) {
            return {
                newPasswordsAreNotEqual: true
            }
        }

        return null;
    }
}