import { ExamMapping } from './../shared/config/index';
import { ExamService } from './../shared/services/exam.service';
import { DataDriveService } from './../../../shared/components/data-drive/core/services/data-drive.service';
import { UtilService } from './../../../core/services/util.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../shared/components/data-drive/shared/models/index';

@Component({
  selector: 'app-exam-unit',
  templateUrl: './exam-unit.component.html',
  styleUrls: ['./exam-unit.component.css']
})
export class ExamUnitComponent implements OnInit {

  headerDataDrive: DataDrive;

  contentDataDrive: DataDrive;

  questionsDrive: DataDrive;
  tabIdx;
  isAddingQuestion;
  targetExam;
  constructor(
    private util: UtilService,
    private dataDriveService: DataDriveService,
    private examService: ExamService,
  ) { }

  ngOnInit() {
  }

  getHeaderDrive(d: DataDrive) {
    this.headerDataDrive = d;
    this.toSetExamDetail();
  }

  getContentDrive(d: DataDrive) {
    this.contentDataDrive = d;
    this.changeContentSearch();
  }

  getQuestionsDrive(d: DataDrive) {
    this.questionsDrive = d;
    this.questionsDrive.setParamsOut('加入考卷');
    this.questionsDrive.onParamsOut((d) => {
      console.log(d);
      const send: ExamMapping = {
        ID:0,
        EXAM_ID: this.targetExam.ID,
        QUESTION_ID: d.ID,
        NUM: 0,
        SCORE: 1,
        COMPANY_ID: ''
      }
      this.examService.UpdateMapping(send).subscribe(a => {
        console.log(a);
        this.dataDriveService.updateViewData(this.contentDataDrive);
      })
    })
  }

  changeContentSearch() {
    this.contentDataDrive.beforeSearch((data) => {
      return Object.assign(data, {exam_id: this.targetExam.ID});
    })
  }

  toSetExamDetail() {
    this.headerDataDrive.onParamsOut((d) => {
      console.log(d)
      this.targetExam = d;
      this.tabIdx = 1;
    })
  }

  tabChange(idx) {
    if(idx === 1) {
      if(!this.targetExam) {
        this.util.showWarningConfirm({title:'您還沒有選擇要維護的考卷',content: '將返回到考卷頭維護處'},() => {
          this.tabIdx = 0;
        })
      }else {
        this.dataDriveService.updateViewData(this.contentDataDrive);
      } 
    }
  }

}
