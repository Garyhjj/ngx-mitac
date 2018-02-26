import { UtilService } from './../../../../core/services/util.service';
import { NgxValidatorExtendService } from './../../../../core/services/ngx-validator-extend.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { InspectionBossService } from './../shared/services/inspection-boss.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models/index';
import { isArray } from '../../../../shared/utils/index';
import { DataDriveService } from './../../../../shared/components/data-drive/core/services/data-drive.service';

@Component({
  selector: 'app-inspection-boss-comment',
  templateUrl: './inspection-boss-comment.component.html',
  styleUrls: ['./inspection-boss-comment.component.css']
})
export class InspectionBossCommentComponent implements OnInit {

  isVisible = false;
  formLayout = 'horizontal';
  myForm: FormGroup;
  editData;
  dataDrive: DataDrive
  constructor(
    private inspectionBossService: InspectionBossService,
    private fb: FormBuilder,
    private validatorExtendService: NgxValidatorExtendService,
    private dataDriveService: DataDriveService,
    private util: UtilService
  ) { }

  ngOnInit() {
  }

  getDataDrive(d: DataDrive) {
    this.dataDrive = d;
    d.setParamsOut('評分');
    d.onParamsOut((data) => {
      const id = this.util.showLoading();
      const finalFn = (id) => this.util.dismissLoading(id);
      this.inspectionBossService.getReport(data.HEADER_ID).subscribe(r => {
        this.intForm(r);
        this.editData = r;
        this.isVisible = true;
        finalFn(id);
      }, err => {this.util.errDeal(err); finalFn(id)})
    })
  };

  intForm(data) {
    this.myForm = null;
    const litsFormArray = [];
    if (isArray(data.Lines)) {
      data.Lines.forEach((l) => litsFormArray.push(this.initSubForm(l)));
    }
    this.myForm = this.fb.group({
      SCORE: [data.Header && data.Header.SCORE || 0],
      ADDITIONAL_SCORE: [data.Header && data.Header.ADDITIONAL_SCORE || 0],
      list: this.fb.array(litsFormArray)
    });
    this.myForm.get('ADDITIONAL_SCORE').valueChanges.subscribe((c) => {
      this.calTotalScore();
    });
  }
  initSubForm(l) {
    const sub = this.fb.group({
      LINE_ID: [l.LINE_ID],
      INSPECT_TIME: [l.INSPECT_TIME],
      LOCATION: [l.LOCATION],
      PROBLEM_DESC: [l.PROBLEM_DESC],
      PROBLEM_FLAG: [l.PROBLEM_FLAG],
      PROBLEM_PICTURES: [l.PROBLEM_PICTURES],
      OWNER_EMPNO: [l.OWNER_EMPNO],
      SCORE: [l.SCORE, this.validatorExtendService.required()]
    });
    sub.get('SCORE').valueChanges.subscribe((c) => {
      this.calTotalScore();
    });
    return sub;
  }

  calTotalScore() {
    let list = this.myForm.get('list') as FormArray;
    let total = 0;
    Array.prototype.forEach.call(list.controls, (c) => {
      let val = c.get('SCORE').value || 0;
      total += val;
    });
    total += this.myForm.get('ADDITIONAL_SCORE').value;
    this.myForm.get('SCORE').setValue(total);
  }

  submitForm() {
    const val = this.myForm.value;
    const lines = val.list;
    Object.assign(this.editData.Header, { SCORE: val.SCORE, ADDITIONAL_SCORE: val.ADDITIONAL_SCORE });
    this.editData.Lines = this.editData.Lines.map(l => {
      const tar = lines.find(d => d.LINE_ID === l.LINE_ID);
      tar && Object.assign(l, tar);
      return l;
    });
    const id = this.util.showLoading();
    const finalFn = (id) => this.util.dismissLoading(id);
    this.inspectionBossService.uploadReport(this.editData).subscribe(c => {
      finalFn(id);
      this.util.showGlobalSucMes('評分成功');
      this.isVisible = false;
      this.dataDriveService.updateViewData(this.dataDrive);
    }, err => {this.util.errDeal(err); finalFn(id)});
  }

}
