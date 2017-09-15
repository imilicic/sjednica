import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DocumentService } from '../shared/services/document.service';
import { ToastrService } from '../../../shared/services/toastr.service';

@Component({
    templateUrl: './document-update.component.html'
})

export class DocumentUpdateComponent implements OnInit {
    private agendaItemId: number;
    private description: FormControl[];
    private documents: any[];
    private documentForms: FormGroup[];
    private meetingId: number;
    private URL: FormControl[];

    constructor(
        private activatedRoute: ActivatedRoute,
        private documentService: DocumentService,
        private router: Router,
        private toastrService: ToastrService
    ) { }

    ngOnInit() {
        this.agendaItemId = this.activatedRoute.snapshot.params['agendaItemId'];
        this.documents = this.activatedRoute.snapshot.data['documents'];
        this.meetingId = this.activatedRoute.snapshot.params['meetingId'];

        this.description = [];
        this.URL = [];
        this.documentForms = [];

        this.buildForm();
    }

    private buildForm() {
        this.documents.forEach((document, i) => {
            this.description.push(new FormControl(this.documents[i].Description, Validators.required));
            this.URL.push(new FormControl(this.documents[i].URL, [Validators.required,
            Validators.pattern(
                '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$'
            )]));

            this.documentForms.push(new FormGroup({
                description: this.description[i],
                URL: this.URL[i]
            }));
        });
    }

    private replaceDocument(i: number) {
        let newDocument: any = {
            Description: this.description[i].value,
            URL: this.URL[i].value
        };

        this.documentService.replaceDocument(this.meetingId, this.agendaItemId, this.documents[i].DocumentId, newDocument)
        .subscribe((document: any) => {
            this.toastrService.success('Spremljeno!');
        }, (error: string) => {
            this.toastrService.error(error);
        });
    }
}
