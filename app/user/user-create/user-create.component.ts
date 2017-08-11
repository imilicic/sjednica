import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { User } from "../shared/models/user.model";
import { PasswordService } from "../../shared/providers/password.service";
import { ResponseMessagesService } from "../../shared/providers/response-messages.service";
import { ToastrService } from "../../shared/providers/toastr.service";
import { UserService } from "../shared/providers/user.service";

@Component({
    styleUrls: ["app/user/user-create/user-create.component.ts"],
    templateUrl: "app/user/user-create/user-create.component.html"
})
export class UserCreateComponent implements OnInit {
    councilperson: FormControl;
    email: FormControl;
    firstName: FormControl;
    lastName: FormControl;
    password: string;
    permanentMember: FormControl;
    phoneNumber: FormControl;
    userForm: FormGroup;

    startDay: FormControl;
    startMonth: FormControl;
    startYear: FormControl;

    endDay: FormControl;
    endMonth: FormControl;
    endYear: FormControl;

    months: string[] = [
        "siječanj", "veljača", "ožujak", "travanj",
        "svibanj", "lipanj", "srpanj", "kolovoz",
        "rujan", "listopad", "studeni", "prosinac"
    ];

    appendDateForm() {
        if (this.councilperson.value) {
            this.userForm.addControl("startDay", this.startDay);
            this.userForm.addControl("startMonth", this.startMonth);
            this.userForm.addControl("startYear", this.startYear);

            this.userForm.addControl("endDay", this.endDay);
            this.userForm.addControl("endMonth", this.endMonth);
            this.userForm.addControl("endYear", this.endYear);

            this.userForm.addControl("permanentMember", this.permanentMember);

            this.userForm.setValidators(dateValidator());
        } else {
            this.userForm.clearValidators();

            this.userForm.removeControl("startDay");
            this.userForm.removeControl("startMonth");
            this.userForm.removeControl("startYear");

            this.userForm.removeControl("endDay");
            this.userForm.removeControl("endMonth");
            this.userForm.removeControl("endYear");

            this.userForm.removeControl("permanentMember");
        }
    }

    constructor(
        private passwordService: PasswordService,
        private responseMessagesService: ResponseMessagesService,
        private router: Router,
        private toastrService: ToastrService,
        private userService: UserService
    ) {}

    create() {
        let endDate = null;
        let startDate = null;

        if (this.councilperson.value) {
            endDate = new Date(Date.UTC(this.endYear.value, this.endMonth.value - 1, this.endDay.value));
            startDate = new Date(Date.UTC(this.startYear.value, this.startMonth.value - 1, this.startDay.value));

            if (this.permanentMember.value) {
                endDate = new Date(Date.UTC(9999, 11, 31));
            }
        }

        let newUser: User = {
            Councilperson: this.councilperson.value,
            Email: this.email.value,
            EndDate: endDate,
            FirstName: this.firstName.value,
            LastName: this.lastName.value,
            Password: this.password,
            PersonId: undefined,
            PhoneNumber: this.phoneNumber.value,
            RoleName: undefined,
            StartDate: startDate
        };
        
        this.userService.createUser(newUser)
        .subscribe((response: string) => {
            this.toastrService.success(response);
            this.router.navigate(["user"]);
        },
        (error: string) => this.toastrService.error(error));
    }

    ngOnInit() {
        let currentDate = new Date();
        this.startDay = new FormControl(currentDate.getDate(), Validators.required);
        this.startMonth = new FormControl(currentDate.getMonth()+1, Validators.required);
        this.startYear = new FormControl(currentDate.getFullYear(), [Validators.required, Validators.min(1900), Validators.max(9999)]);

        this.permanentMember = new FormControl(false);
        let dateNextYear = new Date(currentDate.getFullYear()+1, currentDate.getMonth(), currentDate.getDate());
        this.endDay = new FormControl(dateNextYear.getDate(), Validators.required);
        this.endMonth = new FormControl(dateNextYear.getMonth()+1, Validators.required);
        this.endYear = new FormControl(dateNextYear.getFullYear(), [Validators.required, Validators.min(1900), Validators.max(9999)]);

        this.password = this.passwordService.generatePassword(8, 4, 2);
        console.log(this.password);

        this.councilperson = new FormControl(false);
        this.email = new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/)]);
        this.firstName = new FormControl("", Validators.required);
        this.lastName = new FormControl("", Validators.required);
        this.phoneNumber = new FormControl(undefined, Validators.pattern(/^[0-9]{3} [0-9]{6,10}$/));

        this.userForm = new FormGroup({
            councilperson: this.councilperson,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber
        });
    }

    range(n: number): number[] {
        let result = [];

        for(let i = 1; i <= n; i++) {
            result.push(i);
        }

        return result;
    }

    getWarningMessage(code: string) {
        return this.responseMessagesService.getMessage({
            location: "createUser",
            code: code
        });
    }
}

function dateValidator() {
    return (formGroup: FormGroup) => {
        let startDay = formGroup.controls["startDay"].value;
        let startMonth = formGroup.controls["startMonth"].value - 1;
        let startYear = formGroup.controls["startYear"].value;

        let endDay = formGroup.controls["endDay"].value;
        let endMonth = formGroup.controls["endMonth"].value - 1;
        let endYear = formGroup.controls["endYear"].value;
        
        let startDate = new Date(startYear, startMonth, startDay);
        let endDate = new Date(endYear, endMonth, endDay);
        
        if (startDate.getDate() != startDay || startDate.getMonth() != startMonth || startDate.getFullYear() != startYear) {
            return {
                startDateInvalid: true
            }
        }
        
        if (endDate.getDate() != endDay || endDate.getMonth() != endMonth || endDate.getFullYear() != endYear) {
            return {
                endDateInvalid: true
            }
        }

        if (startDate >= endDate) {
            return {
                startDateAfterEndDate: true
            }
        }

        return null;
    }
}