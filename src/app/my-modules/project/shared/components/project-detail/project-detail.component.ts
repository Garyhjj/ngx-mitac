import { ProjectService } from './../../services/project.service';
import { DataDriveService } from './../../../../../shared/components/data-drive/core/services/data-drive.service';
import { TaskDetailComponent } from './../task-detail/task-detail.component';
import { Observable } from 'rxjs/Observable';
import { DataDrive } from './../../../../../shared/components/data-drive/shared/models/index';
import { NzModalService } from 'ng-zorro-antd';
import { AuthService } from './../../../../../core/services/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { isArray } from '../../../../../shared/utils';

const people = [
  {
    PERSON: 'FE716',
  },
  {
    PERSON: 'FE717',
  },
];
@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnInit {
  history;
  empno = this.auth.user.EMPNO;
  dataDriveSub;
  dataDrivePeople;
  dataDriveNoAssignee: DataDrive;
  dataDriveOutTime: DataDrive;
  dataDriveClosed: DataDrive;
  dataDriveFinished: DataDrive;
  noAssigneeTips = 0;
  normalTips = 0;
  outTimeTips = 0;
  needConfimTips = 0;
  _project;
  targetTask;
  @Input() afterBigChange: () => void;
  @Input()
  set project(p) {
    this._project = p;
    const update = (d: DataDrive) => {
      d.beforeSearch(data => {
        data = data || {};
        data.HEADER_ID = p.ID;
        return data;
      });
      this.dataDriveService.updateViewData(d);
    };
    this.getHistory(p.ID);
    if (this.dataDriveSub) {
      update(this.dataDriveSub);
    }
    if (this.dataDrivePeople) {
      update(this.dataDrivePeople);
    }
  }

  get project() {
    return this._project;
  }

  get isOwner() {
    return this.project && this.project.OWNER === this.empno;
  }
  bodyCellStyle = (data, prop) => {
    if (this.targetTask && this.targetTask.ID === data.ID) {
      return {
        'background-color': '#e6f7ff',
      };
    }
  };
  constructor(
    private modalService: NzModalService,
    private auth: AuthService,
    private dataDriveService: DataDriveService,
    private projectService: ProjectService,
  ) {}

  ngOnInit() {}

  getHistory(id) {
    this.projectService.getProjectHistory(id).subscribe(res => {
      console.log(res);
      this.history = res;
    });
  }

  getDataDrivePeople(d: DataDrive) {
    this.dataDrivePeople = d;
    d.dataViewSet.more.showAction = d.tableData.addable = this.isOwner;
    d.onUpdateData(data => {
      data.HEADER_ID = this.project.ID;
      return data;
    });
    d.beforeSearch(data => {
      data = data || {};
      data.HEADER_ID = this.project.ID;
      return data;
    });
    this.dataDriveService.updateViewData(d);
  }

  getDataDriveSub(d: DataDrive) {
    this.dataDriveSub = d;
    d.tableData.addable = d.tableData.editable = d.tableData.deletable = this.isOwner;
    d.onUpdateData(data => {
      data.HEADER_ID = this.project.ID;
      return data;
    });
    d.beforeInsideUpdateView(() => {
      setTimeout(() => {
        this.getHistory(this.project.ID);
      }, 500);
    });
    d.afterDataInit(data => (this.normalTips = data.length));
    d.onUpdateData(data => {
      data.ASSIGNER = this.empno;
      data.STATUS = data.STATUS || 'Open';
      data.HEADER_ID = this.project.ID;
      return data;
    });
    d.beforeSearch(data => {
      data = data || {};
      data.HEADER_ID = this.project.ID;
      return data;
    });
    d.beforeInsideUpdateView(() => {
      this.updateParent();
    });
    d.beforeInitTableData(data => {
      let noAssignee = [],
        outTime = [],
        normal = [],
        finished = [],
        closed = [];
      if (isArray(data)) {
        data.forEach(l => {
          const status = l.STATUS;
          switch (status) {
            case 'Open':
              if (l.DUE_DATE) {
                if (
                  new Date().getTime() -
                    (new Date(l.DUE_DATE).getTime() + 1000 * 60 * 60 * 24) >
                  0
                ) {
                  outTime.push(l);
                } else {
                  if (l.ASSIGNEE) {
                    normal.push(l);
                  } else {
                    noAssignee.push(l);
                  }
                }
              } else {
                if (l.ASSIGNEE) {
                  normal.push(l);
                } else {
                  noAssignee.push(l);
                }
              }
              break;
            case 'Finished':
              finished.push(l);
              break;
            case 'Closed':
              closed.push(l);
              break;
          }
        });
      }
      this.dataDriveNoAssignee.selfUpdateTableData(noAssignee);
      this.dataDriveOutTime.selfUpdateTableData(outTime);
      this.dataDriveFinished.selfUpdateTableData(finished);
      this.dataDriveClosed.selfUpdateTableData(closed);
      return normal;
    });
    this.dataDriveService.updateViewData(d);
  }
  getDataDriveSub0(d: DataDrive) {
    d.tableData.editable = d.tableData.deletable = this.isOwner;
    this.dataDriveNoAssignee = d;
    d.afterDataInit(data => (this.noAssigneeTips = data.length));
    this.stopInsideUpdate(d);
  }
  getDataDriveSub1(d: DataDrive) {
    d.tableData.editable = d.tableData.deletable = this.isOwner;
    this.dataDriveOutTime = d;
    d.afterDataInit(data => (this.outTimeTips = data.length));
    this.stopInsideUpdate(d);
  }
  getDataDriveSub2(d: DataDrive) {
    this.dataDriveFinished = d;
    d.afterDataInit(data => (this.needConfimTips = data.length));
    this.stopInsideUpdate(d);
  }
  getDataDriveSub3(d: DataDrive) {
    this.dataDriveClosed = d;
    this.stopInsideUpdate(d);
  }
  stopInsideUpdate(d: DataDrive) {
    d.beforeInsideUpdateView(() => {
      this.updateSubData();
      return false;
    });
  }
  updateSubData() {
    this.dataDriveService.updateViewData(this.dataDriveSub);
  }
  seeTaskDetail(data) {
    this.targetTask = data;
    const subscription = this.modalService.create({
      nzTitle: '任务细节',
      nzContent: TaskDetailComponent,
      nzOnOk() {},
      nzOnCancel() {},
      nzFooter: null,
      nzComponentParams: {
        task: data,
      },
      nzWidth: '80vw',
    });
    subscription.afterClose.subscribe(_ => (this.targetTask = null));
  }
  CloseTask(t) {
    t.STATUS = 'Closed';
    this.dataDriveService.updateData(this.dataDriveSub, t).subscribe(() => {
      this.updateSubData();
      this.updateParent();
    });
  }
  rollbackTask(t) {
    t.STATUS = 'Open';
    this.dataDriveService.updateData(this.dataDriveSub, t).subscribe(() => {
      this.updateSubData();
    });
  }

  updateParent() {
    if (typeof this.afterBigChange === 'function') {
      this.afterBigChange();
    }
  }
}
