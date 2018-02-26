import { NgxValidatorExtendService } from './../../../core/services/ngx-validator-extend.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drive-edit',
  templateUrl: './drive-edit.component.html',
  styleUrls: ['./drive-edit.component.css']
})
export class DriveEditComponent implements OnInit {
  formLayout = 'horizontal';
  setForm: FormGroup
  constructor(
    private fb: FormBuilder,
    private validatorExtendService: NgxValidatorExtendService
  ) { }

  ngOnInit() {
    this.setForm = this.fb.group({
      APIs: this.fb.group({
        search: ['', this.validatorExtendService.required()],
        update: [''],
        delete: ['']
      })
    })
  }

}
