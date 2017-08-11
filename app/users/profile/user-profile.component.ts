import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { PasswordService } from "../../shared/providers/password.service";
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
        private passwordService: PasswordService,
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
            let password = this.passwordService.generatePassword(8, 4, 2);

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