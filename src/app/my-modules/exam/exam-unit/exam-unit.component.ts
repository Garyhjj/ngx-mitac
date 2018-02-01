import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../shared/components/data-drive/shared/models/index';

@Component({
  selector: 'app-exam-unit',
  templateUrl: './exam-unit.component.html',
  styleUrls: ['./exam-unit.component.css']
})
export class ExamUnitComponent implements OnInit {

  dataDrive: DataDrive
  constructor() { }

  ngOnInit() {
  }

  getDrive(d: DataDrive) {
    this.dataDrive = d;
    this.toSetExamDetail();
  }

  toSetExamDetail() {
    this.dataDrive.onParamsOut((d) => {
      console.log(d)
    })
  }

}
