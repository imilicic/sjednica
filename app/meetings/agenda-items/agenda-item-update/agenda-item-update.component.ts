import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AgendaItem } from '../../../shared/models/agenda-item.model';
import { AgendaItemService } from '../shared/services/agenda-item.service';
import { Meeting } from '../../../shared/models/meeting.model';
import { ToastrService } from '../../../shared/services/toastr.service';

@Component({
    templateUrl: './agenda-item-update.component.html'
})

export class AgendaItemUpdateComponent implements OnInit {
    private meeting: Meeting;
    private text: FormControl[];
    private agendaItemForms: FormGroup[];

    constructor(
        private activatedRoute: ActivatedRoute,
        private agendaItemService: AgendaItemService,
        private router: Router,
        private toastrService: ToastrService
    ) { }

    ngOnInit() {
        this.meeting = this.activatedRoute.snapshot.data['meeting'];
        this.meeting.AgendaItems = this.activatedRoute.snapshot.data['agendaItems'];

        if (this.isToday() || this.isPassed()) {
            this.router.navigate(['meetings', this.meeting.MeetingId]);
            return;
        }

        this.buildForm();
    }

    private buildForm() {
        this.agendaItemForms = [];
        this.text = [];

        this.meeting.AgendaItems.forEach((agendaItem: AgendaItem, i) => {
            this.text.push(new FormControl(agendaItem.Text, Validators.required));

            this.agendaItemForms.push(new FormGroup({
                text: this.text[i]
            }));
        });
    }

    private isPassed() {
        let date = new Date(this.meeting.DateTime);
        let now = new Date();

        return now >= date;
    }

    private isToday() {
        let date = new Date(this.meeting.DateTime);
        let now = new Date();

        return date.getDate() === now.getDate() &&  date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    }

    private updateAgendaItem(i: number) {
        let newAgendaItem: AgendaItem = {
            AgendaItemId: undefined,
            Text: this.text[i].value,
            Number: i + 1
        };

        this.agendaItemService.replaceAgendaItem(this.meeting.MeetingId, this.meeting.AgendaItems[i].AgendaItemId, newAgendaItem)
        .subscribe((agendaItem: AgendaItem) => {
            this.toastrService.success('Spremljeno!');
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }
}
