import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CouncilMember } from '../../shared/models/council-member.model';
import { CouncilMemberService } from '../shared/services/council-member.service';
import { dateValidator } from '../shared/validators';
import { ResponseMessagesService } from '../../shared/services/response-messages.service';
import { ToastrService } from '../../shared/services/toastr.service';
import { UserService } from '../shared/services/user.service';
import { User } from '../../shared/models/user.model';

@Component({
    templateUrl: './council-member-create.component.html',
    styles: [`
        .error {
            float: right;
            margin: 0px;
        }
    `]
})

export class CouncilMemberCreateComponent implements OnInit {
    private councilMemberForm: FormGroup;
    private endDay: FormControl;
    private endMonth: FormControl;
    private endYear: FormControl;
    private filterFinished: boolean;
    private months: string[];
    private userId: FormControl;
    private permanentMember: FormControl;
    private startDay: FormControl;
    private startMonth: FormControl;
    private startYear: FormControl;
    private users: User[];

    constructor(
        private councilMemberService: CouncilMemberService,
        private responseMessagesService: ResponseMessagesService,
        private router: Router,
        private toastrService: ToastrService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.filterFinished = false;
        this.months = [
            'siječanj', 'veljača', 'ožujak', 'travanj',
            'svibanj', 'lipanj', 'srpanj', 'kolovoz',
            'rujan', 'listopad', 'studeni', 'prosinac'
        ];
        this.users = [];

        this.userService.retrieveUsers()
        .subscribe((users: User[]) => {
            this.users = users;
        });

        this.councilMemberService.retrieveCouncilMembers()
        .subscribe((councilMembers: CouncilMember[]) => {
            let interval = setInterval(() => {
                if (this.users.length > 0) {
                    councilMembers.forEach((member) => {
                        let foundUser = this.users.find(user => user.Email === member.Email);

                        this.users.splice(this.users.indexOf(foundUser), 1);
                    });

                    this.filterFinished = true;
                    clearInterval(interval);
                }
            }, 500);
        });

        this.buildForm();
    }

    private buildForm() {
        this.permanentMember = new FormControl(false, Validators.required);
        this.userId = new FormControl('', Validators.required);

        let now = new Date();
        this.startDay = new FormControl(now.getDate(), Validators.required);
        this.startMonth = new FormControl(now.getMonth() + 1, Validators.required);
        this.startYear = new FormControl(now.getFullYear(), [Validators.required, Validators.min(1900), Validators.max(9999)]);

        let next = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        this.endDay = new FormControl(next.getDate(), Validators.required);
        this.endMonth = new FormControl(next.getMonth() + 1, Validators.required);
        this.endYear = new FormControl(next.getFullYear(), [Validators.required, Validators.min(1900), Validators.max(9999)]);

        this.councilMemberForm = new FormGroup({
            endDay: this.endDay,
            endMonth: this.endMonth,
            endYear: this.endYear,
            permanentMember: this.permanentMember,
            userId: this.userId,
            startDay: this.startDay,
            startMonth: this.startMonth,
            startYear: this.startYear
        });

        this.councilMemberForm.setValidators([dateValidator(true)]);
    }

    private createCouncilMember() {
        let startDate = this.generateDateString(this.startYear.value, this.startMonth.value, this.startDay.value);
        let endDate = this.generateDateString(this.endYear.value, this.endMonth.value, this.endDay.value);
        let newCouncilMember = {
            StartDate: startDate,
            EndDate: endDate,
            UserId: this.userId.value
        };

        this.councilMemberService.createCouncilMember(newCouncilMember)
        .subscribe((councilMember: CouncilMember) => {
            this.toastrService.success('Korisnik je dodan kao član vijeća!');
            this.router.navigate(['council-members', councilMember.CouncilMemberId]);
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }

    private generateDateString(year: number, month: number, day: number): string {
        let monthString = '';
        let dayString = '';

        if (month < 10) {
            monthString = '0';
        }

        monthString +=  month.toString();

        if (day < 10) {
            dayString = '0';
        }

        dayString +=  day.toString();

        return year.toString() + '-' + monthString + '-' + dayString;
    }

    private getWarningMessage(code: string) {
        return this.responseMessagesService.getMessage({
            location: 'users/create',
            code: code
        });
    }

    private range(n: number): number[] {
        let result = [];

        for (let i = 1; i <= n; i++) {
            result.push(i);
        }

        return result;
    }

    private togglePermanentMember() {
        if (this.permanentMember.value) {
            this.endDay.setValue(31);
            this.endMonth.setValue(12);
            this.endYear.setValue(9999);
        } else {
            let next = new Date(this.startYear.value + 1, this.startMonth.value - 1, this.startDay.value);

            this.endDay.setValue(next.getDate());
            this.endMonth.setValue(next.getMonth() + 1);
            this.endYear.setValue(next.getFullYear());
        }
    }
}
