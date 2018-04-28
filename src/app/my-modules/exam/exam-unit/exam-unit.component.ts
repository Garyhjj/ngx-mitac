import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { ExamMapping } from './../shared/config/index';
import { ExamService } from './../shared/services/exam.service';
import { DataDriveService } from './../../../shared/components/data-drive/core/services/data-drive.service';
import { UtilService } from './../../../core/services/util.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataDrive } from '../../../shared/components/data-drive/shared/models/index';
import { AuthService } from '../../../core/services/auth.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-exam-unit',
  templateUrl: './exam-unit.component.html',
  styleUrls: ['./exam-unit.component.css'],
})
export class ExamUnitComponent implements OnInit, OnDestroy {
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
      time: t.TIME,
    });
  }
  translateTexts: any;
  sub: Subscription;
  role = this.examService.role;
  constructor(
    private util: UtilService,
    private dataDriveService: DataDriveService,
    private examService: ExamService,
    private auth: AuthService,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.sub = this.translateService
      .stream([
        'examModule.maintenanceExam',
        'examModule.addToExam',
        'examModule.maintenanceWainTitle',
        'examModule.maintenanceWainContent',
      ])
      .subscribe(_ => (this.translateTexts = _));
  }
  ngOnDestroy() {
    if (this.sub instanceof Subscription) {
      this.sub.unsubscribe();
    }
  }

  getHeaderDrive(d: DataDrive) {
    this.headerDataDrive = d;
    d.setParamsOut(this.translateTexts['examModule.maintenanceExam']);
    this.alterHeaderByRole();
    this.toSetExamDetail();
  }

  alterHeaderByRole() {
    if (this.examService.role === 2) {
      const depNo = this.auth.user.DEPTNO;
      this.headerDataDrive.updateSets = this.headerDataDrive.updateSets.filter(
        c => c.property !== 'REF_DEPT',
      );
      this.headerDataDrive.onUpdateFormShow(fg => {
        fg.addControl('REF_DEPT', new FormControl(depNo));
      });
      this.headerDataDrive.searchSets = this.headerDataDrive.searchSets.filter(
        c => c.property !== 'REF_DEPT',
      );
      this.headerDataDrive.beforeSearch(data => {
        return Object.assign(data, { ref_dept: depNo });
      });
    }
  }

  getContentDrive(d: DataDrive) {
    this.contentDataDrive = d;
    this.changeContentSearch();
  }

  getQuestionsDrive(d: DataDrive) {
    this.questionsDrive = d;
    this.questionsDrive.setParamsOut(
      this.translateTexts['examModule.addToExam'],
    );
    this.questionsDrive.onParamsOut(ds => {
      const send: ExamMapping = {
        ID: 0,
        EXAM_ID: this._targetExam.ID,
        QUESTION_ID: ds.ID,
        NUM: 0,
        SCORE: 1,
        COMPANY_ID: '',
      };
      this.examService.updateMapping(send).subscribe(
        a => {
          this.dataDriveService.updateViewData(this.contentDataDrive);
        },
        err => this.util.errDeal(err),
      );
    });
  }

  changeContentSearch() {
    this.contentDataDrive.beforeSearch(data => {
      return Object.assign(data, {
        exam_id: this._targetExam ? this._targetExam.ID : 0,
      });
    });
  }

  toSetExamDetail() {
    this.headerDataDrive.onParamsOut(d => {
      this.targetExam = d;
      this.tabIdx = 1;
    });
  }

  tabChange(idx) {
    if (idx === 1) {
      if (!this._targetExam) {
        this.util.showWarningConfirm(
          {
            title: this.translateTexts['examModule.maintenanceWainTitle'],
            content: this.translateTexts['examModule.maintenanceWainContent'],
          },
          () => {
            this.tabIdx = 0;
          },
        );
      } else {
        this.dataDriveService.updateViewData(this.contentDataDrive);
      }
    }
  }
}
