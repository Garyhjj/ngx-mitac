import { AuthService } from './../../../core/services/auth.service';
import { DataDriveService } from './../../../shared/components/data-drive/core/services/data-drive.service';
import { ProjectService } from './../shared/services/project.service';
import { DataDrive } from './../../../shared/components/data-drive/shared/models/index';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-scan',
  templateUrl: './project-scan.component.html',
  styleUrls: ['./project-scan.component.css'],
})
export class ProjectScanComponent implements OnInit {
  targetProject;
  openDataDrive: DataDrive;
  outTimeDataDrive: DataDrive;
  finishDataDrive: DataDrive;
  normalTips = 0;
  outTimeTips = 0;
  getAPI =
    'projects/headers?status={status}&startDate={startDate}&endDate={endDate}&member={*EMPNO}&owner={OWNER}&type={TYPE}&code={CODE}&parent={PARENT_HEADER}';
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

  changeNameSet(d: DataDrive) {
    d.changeNameSets({
      actionCol: '操作',
    });
  }

  getDataDrive1(d: DataDrive) {
    this.changeNameSet(d);
    this.openDataDrive = d;
    d.APIs.search = this.getAPI;
    d.tableData.searchable = true;
    d.beforeInitTableData(data => {
      const { normal, outTime } = this.projectService.filterDataByDate(data);
      return normal;
    });
    d.beforeSearch(data => {
      data = data || {};
      data.status = 'Open';
      return data;
    });
    d.afterDataInit(data => (this.normalTips = data.length));
  }

  getDataDrive2(d: DataDrive) {
    this.changeNameSet(d);
    d.APIs.search = this.getAPI;
    d.tableData.searchable = true;
    this.outTimeDataDrive = d;
    d.afterDataInit(data => (this.outTimeTips = data.length));
    d.beforeSearch(data => {
      data = data || {};
      data.status = 'Open';
      return data;
    });
    d.beforeInitTableData(data => {
      const { normal, outTime } = this.projectService.filterDataByDate(data);
      return outTime;
    });
  }

  getDataDrive3(d: DataDrive) {
    this.changeNameSet(d);
    d.APIs.search = this.getAPI;
    d.tableData.searchable = true;
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
