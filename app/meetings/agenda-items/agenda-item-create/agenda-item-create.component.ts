import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AgendaItem } from '../../../shared/models/agenda-item.model';
import { ToastrService } from '../../../shared/services/toastr.service';
import { AgendaItemService } from '../../shared/services/agenda-item.service';

@Component({
    templateUrl: './agenda-item-create.component.html'
})
export class AgendaItemCreateComponent implements OnInit {
    private agendaItemForm: FormGroup;
    private createdAgendaItems: AgendaItem[];
    private number: FormControl;
    private numberAutoComplete: number;
    private text: FormControl;

    constructor(
        private activatedRoute: ActivatedRoute,
        private agendaItemService: AgendaItemService,
        private router: Router,
        private toastrService: ToastrService
    ) {}

    ngOnInit() {
        this.createdAgendaItems = this.activatedRoute.snapshot.data['agendaItems'];

        if (this.createdAgendaItems.length > 0) {
            this.numberAutoComplete = Math.max.apply(Math, this.createdAgendaItems.map(agendaItem => agendaItem.Number)) + 1;
        } else {
            this.numberAutoComplete = 1;
        }

        this.buildForm();
    }

    private buildForm() {
        this.number = new FormControl(this.numberAutoComplete, [Validators.required, Validators.min(1)]);
        this.text = new FormControl('', Validators.required);

        this.agendaItemForm = new FormGroup({
            number: this.number,
            text: this.text
        });
    }

    private createAgendaItem() {
        let newAgendaItem: AgendaItem = {
            AgendaItemId: undefined,
            Number: this.number.value,
            Text: this.text.value
        };

        this.agendaItemService.createAgendaItem(this.activatedRoute.snapshot.params['meetingId'], newAgendaItem)
        .subscribe((agendaItem: AgendaItem) => {
            this.toastrService.success('Točka dnevnog reda je dodana!');
            this.agendaItemForm.reset();
            this.numberAutoComplete++;
            this.number.setValue(this.numberAutoComplete);
            this.createdAgendaItems.push(agendaItem);
        }, (error: string) => {
            this.toastrService.error(error);
        })
    }
}
