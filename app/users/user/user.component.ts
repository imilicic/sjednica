import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../shared/services/authentication.service';

import { User } from '../../shared/models/user.model';

@Component({
    templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
    user: User;
    isThisCurrentUserProfile: Boolean;

    // changePasswordMode: Boolean = false;
    // generatedPassword: Boolean = false;

    // newPassword: FormControl;
    // newPassword2: FormControl;
    // oldPassword: FormControl;
    // passwordForm: FormGroup;

    constructor(
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService
    ) {}

    isPermanentCouncilMember() {
        if (this.user.HistoryCouncilMember[0].EndDate === '9999-12-31') {
            return true;
        } else {
            return false;
        }
    }

    ngOnInit() {
        if (this.activatedRoute.snapshot.params['userId']) {
            this.user = this.activatedRoute.snapshot.data['user'];
            this.isThisCurrentUserProfile = false;
        } else {
            this.user = this.authenticationService.user;
            this.isThisCurrentUserProfile = true;
        }

        // this.newPassword = new FormControl('', [
        //     Validators.required,
        //     Validators.minLength(8),
        //     Validators.pattern(/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]*)$/)
        // ]);
        // this.newPassword2 = new FormControl('', Validators.required);
        // this.oldPassword = new FormControl('', Validators.required);

        // this.passwordForm = new FormGroup({
        //     newPassword: this.newPassword,
        //     newPassword2: this.newPassword2,
        //     oldPassword: this.oldPassword
        // });
        // this.passwordForm.setValidators([areNewPasswordsEqual()]);
    }

    // setGeneratedPassword() {
    //     this.generatedPassword = !this.generatedPassword;

    //     if (this.generatedPassword) {
    //         let password = this.passwordService.generatePassword(8, 4, 2);

    //         this.newPassword.setValue(password);
    //         this.newPassword2.setValue(password);
    //         this.newPassword.markAsTouched();
    //         this.newPassword2.markAsTouched();
    //     } else {
    //         this.newPassword.reset();
    //         this.newPassword2.reset();
    //     }
    // }

    // updateUser() {
    //     this.userService.updateUser({
    //         UserId: 1,
    //         NewPassword: this.newPassword.value,
    //         OldPassword: this.oldPassword.value
    //     }).subscribe((response: string) => {
    //         this.toastrService.success(response);
    //         this.passwordForm.reset();
    //         this.changePasswordMode = false;
    //         this.generatedPassword = false;
    //     }, (error: any) => {
    //         this.toastrService.error(error);
    //         this.passwordForm.reset();
    //     });
    // }
}

// function areNewPasswordsEqual() {
//     return (formGroup: FormGroup) => {
//         let newPassword = formGroup.controls['newPassword'].value;
//         let newPassword2 = formGroup.controls['newPassword2'].value;

//         if (newPassword !== newPassword2) {
//             return {
//                 newPasswordsAreNotEqual: true
//             }
//         }

//         return null;
//     }
// }
