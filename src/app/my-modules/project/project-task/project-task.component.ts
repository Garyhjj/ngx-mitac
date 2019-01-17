import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UtilService } from './../../../core/services/util.service';
import { ProjectService } from './../shared/services/project.service';
import { DataDriveService } from './../../../shared/components/data-drive/core/services/data-drive.service';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataDrive } from '../../../shared/components/data-drive/shared/models';
import { isArray } from '../../../shared/utils';

@Component({
  selector: 'app-project-task',
  templateUrl: './project-task.component.html',
  styleUrls: ['./project-task.component.css'],
})
export class ProjectTaskComponent implements OnInit, OnDestroy {
  progressList = [];
  unDoneDataDrive: DataDrive;
  outTimeDataDrive: DataDrive;
  doneDataDrive: DataDrive;
  finishedDataDrive: DataDrive;
  empno = this.auth.user.EMPNO;
  targetTask;
  doneTask = [];
  normalTips = 0;
  outTimeTips = 0;
  needConfimTips = 0;
  tabIdx = 0;
  translateTexts = {};
  sub: Subscription;
  bodyCellStyle = (data, prop) => {
    const style = {};
    if (this.targetTask && this.targetTask.ID === data.ID) {
      Object.assign(style, {
        'background-color': '#e6f7ff',
      });
    }
    if (prop === 'DESCRIPTION') {
      Object.assign(style, {
        'max-width': '200px',
      });
    }
    return style;
  };
  constructor(
    private auth: AuthService,
    private dataDriveService: DataDriveService,
    private projectService: ProjectService,
    private util: UtilService,
    private translateService: TranslateService,
  ) {}

  getTranslation() {
    this.sub = this.translateService
      .stream([
        'projectModule.actionName',
        'projectModule.addTask',
        'projectModule.finishTaskConfirm',
        'projectModule.notMyTaskConfirm',
        'projectModule.backToOpenBySelfConfirm',
      ])
      .subscribe(t => {
        this.translateTexts = t;
      });
  }
  ngOnInit() {
    this.getTranslation();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  changeNameSetSub(d: DataDrive) {
    d.changeNameSets({
      actionCol: this.translateTexts['projectModule.actionName'],
      add: this.translateTexts['projectModule.addTask'],
    });
  }
  hideStatusTemp(d: DataDrive) {
    d.allHideLists.push('STATUS');
  }

  onDownloadExcel(d: DataDrive) {
    d.onDownloadExcel(data => this.projectService.linesOnDownExcel(data));
  }

  getDataDrive1(d: DataDrive) {
    this.onDownloadExcel(d);
    this.hideStatusTemp(d);
    this.changeNameSetSub(d);
    this.unDoneDataDrive = d;
    d.addDefaultSearchParams({
      ASSIGNEE: this.empno,
      STATUS: 'Open',
    });
    d.beforeInitTableData(data => {
      const { normal, outTime } = this.projectService.filterDataByDate(data);
      this.outTimeDataDrive.selfUpdateTableData(outTime);
      return normal;
    });
    d.afterDataInit(data => (this.normalTips = data.length));
    this.dataDriveService.updateViewData(d);
  }

  getDataDrive2(d: DataDrive) {
    this.onDownloadExcel(d);
    this.hideStatusTemp(d);
    this.changeNameSetSub(d);
    this.outTimeDataDrive = d;
    d.afterDataInit(data => (this.outTimeTips = data.length));
  }

  updateUndone() {
    this.dataDriveService.updateViewData(this.unDoneDataDrive);
  }

  getDataDrive3(d: DataDrive) {
    this.onDownloadExcel(d);
    this.hideStatusTemp(d);
    this.changeNameSetSub(d);
    this.doneDataDrive = d;
    d.addDefaultSearchParams({ ASSIGNEE: this.empno, STATUS: 'Finished' });
    d.afterDataInit(data => (this.needConfimTips = data.length));
    this.dataDriveService.updateViewData(d);
  }
  getDataDrive4(d: DataDrive) {
    this.onDownloadExcel(d);
    this.hideStatusTemp(d);
    this.changeNameSetSub(d);
    this.finishedDataDrive = d;
    d.tableData.searchable = true;
    d.addDefaultSearchParams({ ASSIGNEE: this.empno, STATUS: 'Closed' });
    if (isArray(d.searchSets)) {
      d.searchSets = d.searchSets.filter(s => s.property !== 'ASSIGNEE');
    }
    // this.dataDriveService.updateViewData(d);
  }

  finished(t) {
    const okCb = () => {
      const dismiss = this.util.showLoading2();
      t.STATUS = 'Finished';
      if (this.targetTask && this.targetTask.ID === t.ID) {
        this.targetTask = t;
      }
      this.dataDriveService.updateData(this.unDoneDataDrive, t).subscribe(
        res => {
          this.updateUndone();
          this.dataDriveService.updateViewData(this.doneDataDrive);
          this.tabIdx = 2;
          dismiss();
        },
        err => {
          this.util.errDeal(err);
          dismiss();
        },
      );
    };
    this.util.showBisicConfirmModal({
      title: this.translateTexts['projectModule.finishTaskConfirm'],
      okCb,
    });
  }

  notMyTask(t) {
    const okCb = () => {
      const dismiss = this.util.showLoading2();
      t.ASSIGNEE = t.ASSIGNEE.filter(a => a !== this.empno);
      t.ASSIGNEE_LIST = t.ASSIGNEE;
      t.rejectFlag = 'Y';
      this.dataDriveService.updateData(this.unDoneDataDrive, t).subscribe(
        res => {
          this.updateUndone();
          dismiss();
        },
        err => {
          this.util.errDeal(err);
          dismiss();
        },
      );
    };
    this.util.showBisicConfirmModal({
      title: this.translateTexts['projectModule.notMyTaskConfirm'],
      okCb,
    });
  }

  backToOpen(t) {
    const okCb = () => {
      const dismiss = this.util.showLoading2();
      t.STATUS = 'Open';
      if (this.targetTask && this.targetTask.ID === t.ID) {
        this.targetTask = t;
      }
      this.dataDriveService.updateData(this.unDoneDataDrive, t).subscribe(
        res => {
          this.updateUndone();
          this.dataDriveService.updateViewData(this.doneDataDrive);
          this.tabIdx =
            new Date().getTime() -
              (new Date(t.DUE_DATE).getTime() + 1000 * 60 * 60 * 24) >
            0
              ? 1
              : 0;
          dismiss();
        },
        err => {
          this.util.errDeal(err);
          dismiss();
        },
      );
    };
    this.util.showBisicConfirmModal({
      title: this.translateTexts['projectModule.backToOpenBySelfConfirm'],
      okCb,
    });
  }

  seeDetail(t) {
    this.targetTask = t;
  }
}
