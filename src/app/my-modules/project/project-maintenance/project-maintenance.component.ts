import { ProjectService } from './../shared/services/project.service';
import { DataDriveService } from './../../../shared/components/data-drive/core/services/data-drive.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../shared/components/data-drive/shared/models';
import { isArray } from '../../../shared/utils';

@Component({
  selector: 'app-project-maintenance',
  templateUrl: './project-maintenance.component.html',
  styleUrls: ['./project-maintenance.component.css'],
})
export class ProjectMaintenanceComponent implements OnInit {
  projects = [
    {
      ID: 1,
      NAME: 'moa1',
      START_DATE: '2018-05-01',
      DUE_DATE: '2018-06-01',
      OWNER: this.auth.user.EMPNO,
      TYPE: '客诉',
      DESCRIPTION: '解决XXXX问题',
    },
  ];
  targetProject;
  openDataDrive: DataDrive;
  outTimeDataDrive: DataDrive;
  finishDataDrive: DataDrive;
  normalTips = 0;
  outTimeTips = 0;
  bodyCellStyle = (data, prop) => {
    if (this.targetProject && this.targetProject.ID === data.ID) {
      return {
        'background-color': '#e6f7ff',
      };
    }
  };
  afterTasksBigChange = () => {
    this.dataDriveService.updateViewData(this.openDataDrive);
  };
  constructor(
    private auth: AuthService,
    private dataDriveService: DataDriveService,
    private projectService: ProjectService,
  ) {}

  ngOnInit() {}

  getDataDrive1(d: DataDrive) {
    d.tableData.addable = true;
    d.tableData.editable = true;
    d.tableData.deletable = true;
    this.openDataDrive = d;
    d.beforeInsideUpdateView(() => {
      setTimeout(_ => {
        this.targetProject = Object.assign({}, this.targetProject);
      }, 50);
    });
    d.onUpdateData(data => {
      data.OWNER = this.auth.user.EMPNO;
      data.STATUS = 'Open';
      return data;
    });
    d.beforeInitTableData(data => {
      const { normal, outTime } = this.projectService.filterDataByDate(data);
      this.outTimeDataDrive.selfUpdateTableData(outTime);
      return normal;
    });
    d.beforeSearch(data => {
      data = data || {};
      data.status = 'Open';
      return data;
    });
    d.afterDataInit(data => (this.normalTips = data.length));
    this.dataDriveService.updateViewData(d);
  }

  getDataDrive2(d: DataDrive) {
    d.tableData.editable = true;
    d.tableData.deletable = true;
    this.outTimeDataDrive = d;
    d.afterDataInit(data => (this.outTimeTips = data.length));
    d.beforeInsideUpdateView(() => {
      this.dataDriveService.updateViewData(this.openDataDrive);
      return false;
    });
  }

  getDataDrive3(d: DataDrive) {
    d.tableData.searchable = true;
    d.dataViewSet.more.showAction = false;
    d.beforeSearch(data => {
      data = data || {};
      data.status = 'Closed';
      return data;
    });
  }

  seeDetail(d) {
    this.targetProject = d;
  }
}
