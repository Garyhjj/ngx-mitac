import { ProjectService } from './../shared/services/project.service';
import { DataDriveService } from './../../../shared/components/data-drive/core/services/data-drive.service';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import {
  DataDrive,
  TabelViewSet,
} from '../../../shared/components/data-drive/shared/models';
import * as moment from 'moment';

@Component({
  selector: 'app-project-task',
  templateUrl: './project-task.component.html',
  styleUrls: ['./project-task.component.css'],
})
export class ProjectTaskComponent implements OnInit {
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
  bodyCellStyle = (data, prop) => {
    if (this.targetTask && this.targetTask.ID === data.ID) {
      return {
        'background-color': '#e6f7ff',
      };
    }
  };
  constructor(
    private auth: AuthService,
    private dataDriveService: DataDriveService,
    private projectService: ProjectService,
  ) {}

  ngOnInit() {}

  getDataDrive1(d: DataDrive) {
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
    // setTimeout(_ => {
    //   d.selfUpdateTableData(this.task);
    // });
    // let table = d.dataViewSet as TabelViewSet;
    // if (table.type === 'table') {
    //   table.showCheckbox();
    // }
  }

  getDataDrive2(d: DataDrive) {
    this.outTimeDataDrive = d;
    d.afterDataInit(data => (this.outTimeTips = data.length));
  }

  updateUndone() {
    this.dataDriveService.updateViewData(this.unDoneDataDrive);
  }

  getDataDrive3(d: DataDrive) {
    this.doneDataDrive = d;
    d.addDefaultSearchParams({ STATUS: 'Finished' });
    d.afterDataInit(data => (this.needConfimTips = data.length));
    this.dataDriveService.updateViewData(d);
  }
  getDataDrive4(d: DataDrive) {
    this.finishedDataDrive = d;
    d.addDefaultSearchParams({ STATUS: 'Closed' });
    this.dataDriveService.updateViewData(d);
  }

  finished(t) {
    t.STATUS = 'Finished';
    if (this.targetTask && this.targetTask.ID === t.ID) {
      this.targetTask = t;
    }
    this.dataDriveService.updateData(this.unDoneDataDrive, t).subscribe(res => {
      this.updateUndone();
      this.dataDriveService.updateViewData(this.doneDataDrive);
      this.tabIdx = 2;
    });
  }

  notMyTask(t) {
    t.ASSIGNEE = '';
    this.dataDriveService.updateData(this.unDoneDataDrive, t).subscribe(res => {
      this.updateUndone();
    });
  }

  backToOpen(t) {
    t.STATUS = 'Open';
    if (this.targetTask && this.targetTask.ID === t.ID) {
      this.targetTask = t;
    }
    this.dataDriveService.updateData(this.unDoneDataDrive, t).subscribe(res => {
      this.updateUndone();
      this.dataDriveService.updateViewData(this.doneDataDrive);
      this.tabIdx =
        new Date().getTime() -
          (new Date(t.DUE_DATE).getTime() + 1000 * 60 * 60 * 24) >
        0
          ? 1
          : 0;
    });
  }

  seeDetail(t) {
    this.targetTask = t;
  }
}
