import { FormBuilder, FormGroup } from '@angular/forms';
import { InspectionBossService } from './../shared/services/inspection-boss.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models/index';
import { isArray } from '../../../../shared/utils/index';

@Component({
  selector: 'app-inspection-boss-comment',
  templateUrl: './inspection-boss-comment.component.html',
  styleUrls: ['./inspection-boss-comment.component.css']
})
export class InspectionBossCommentComponent implements OnInit {

  isVisible = false;
  formLayout = 'horizontal';
  myForm: FormGroup
  constructor(
    private inspectionBossService: InspectionBossService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

  getDataDrive(d: DataDrive) {
    d.setParamsOut('評分');
    d.onParamsOut((data) => {
      console.log(data)
      this.inspectionBossService.getReport(data.HEADER_ID).subscribe(r => {
        console.log(r);
        this.intForm(r);
        this.isVisible = true;
      })
    })
  };

  intForm(data) {
    const litsFormArray = [];
    if(isArray(data.Lines)) {
      data.Lines.forEach((l) => litsFormArray.push(this.initSubForm(l)));
    }
    this.myForm = this.fb.group({
      list: this.fb.array(litsFormArray)
    });
    console.log(this.myForm);
  }
  initSubForm(l) {
    const sub =  this.fb.group({
      LINE_ID: [l.LINE_ID],
      INSPECT_TIME: [l.INSPECT_TIME],
      LOCATION: [l.LOCATION],
      PROBLEM_DESC: [l.PROBLEM_DESC],
      PROBLEM_FLAG: [l.PROBLEM_FLAG],
      PROBLEM_PICTURES: [l.PROBLEM_PICTURES],
      OWNER_EMPNO: [l.OWNER_EMPNO],
      SCORE: [l.SCORE]
    });
    sub.get('SCORE').valueChanges.subscribe((c) => {
      console.log(c)
    });
    return sub;
  }

}
