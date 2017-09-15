import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DocumentService } from '../shared/services/document.service';
import { ToastrService } from '../../../shared/services/toastr.service';

@Component({
    templateUrl: './document-create.component.html'
})

export class DocumentCreateComponent implements OnInit {
    private agendaItemId: number;
    private description: FormControl;
    private documentForm: FormGroup;
    private meetingId: number;
    private URL: FormControl;

    constructor(
        private activatedRoute: ActivatedRoute,
        private documentService: DocumentService,
        private router: Router,
        private toastrService: ToastrService
    ) { }

    ngOnInit() {
        this.agendaItemId = this.activatedRoute.snapshot.params['agendaItemId'];
        this.meetingId = this.activatedRoute.snapshot.params['meetingId'];
        this.buildForm();
    }

    private buildForm() {
        this.description = new FormControl('', Validators.required);
        this.URL = new FormControl('', [Validators.required,
            Validators.pattern(
                '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$'
            )]);

        this.documentForm = new FormGroup({
            description: this.description,
            URL: this.URL
        });
    }

    private createDocument() {
        let newDocument: any = {
            Description: this.description.value,
            URL: this.URL.value
        };

        this.documentService.createDocument(this.meetingId, this.agendaItemId, newDocument)
        .subscribe((document: any) => {
            this.toastrService.success('Dodano!');
            this.router.navigate(['meetings/', this.meetingId]);
        }, (error: string) => {
            this.toastrService.error(error);
        })
    }
}
