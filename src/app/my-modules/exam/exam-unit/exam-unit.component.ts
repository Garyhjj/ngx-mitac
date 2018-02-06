import { ExamMapping } from './../shared/config/index';
import { ExamService } from './../shared/services/exam.service';
import { DataDriveService } from './../../../shared/components/data-drive/core/services/data-drive.service';
import { UtilService } from './../../../core/services/util.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../shared/components/data-drive/shared/models/index';
import { AuthService } from '../../../core/services/auth.service';
import { FormControl } from '@angular/forms';

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
  _targetExam;
  set targetExam(t) {
    this._targetExam = t;
    this.contentDataDrive.setViewTempAddtion({
      title: t.TITLE,
      name: this.auth.user.NICK_NAME,
      passScore: t.PASS_SCORE,
      time: t.TIME
    })
  };
  role = this.examService.role;
  constructor(
    private util: UtilService,
    private dataDriveService: DataDriveService,
    private examService: ExamService,
    private auth: AuthService
  ) { }

  ngOnInit() {
  }

  getHeaderDrive(d: DataDrive) {
    this.headerDataDrive = d;
    this.alterHeaderByRole();
    this.toSetExamDetail();
  }

  alterHeaderByRole() {
    if(this.examService.role === 3) {
      const depNo = this.auth.user.DEPTNO;
      this.headerDataDrive.updateSets = this.headerDataDrive.updateSets.filter(c => c.property !== 'REF_DEPT');
      this.headerDataDrive.onUpdateFormShow((fg) => {
        fg.addControl('REF_DEPT', new FormControl(depNo));
      });
      this.headerDataDrive.searchSets = this.headerDataDrive.searchSets.filter(c => c.property !== 'REF_DEPT');
      this.headerDataDrive.beforeSearch((data) => {
        return Object.assign(data, {'ref_dept': depNo});
      })
    }
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
        EXAM_ID: this._targetExam.ID,
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
      return Object.assign(data, {exam_id: this._targetExam?this._targetExam.ID: 0});
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
      if(!this._targetExam) {
        this.util.showWarningConfirm({title:'您還沒有選擇要維護的考卷',content: '將返回到考卷頭維護處'},() => {
          this.tabIdx = 0;
        })
      }else {
        this.dataDriveService.updateViewData(this.contentDataDrive);
      } 
    }
  }

}
