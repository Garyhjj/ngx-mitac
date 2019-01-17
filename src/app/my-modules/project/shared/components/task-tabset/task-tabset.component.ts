import { map } from 'rxjs/operators';
import { TaskDetailComponent } from './../task-detail/task-detail.component';
import { replaceQuery, isArray } from './../../../../../shared/utils/index';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Observable } from 'rxjs';
import { ProjectService } from './../../services/project.service';
import { UtilService } from './../../../../../core/services/util.service';
import { DataDriveService } from './../../../../../shared/components/data-drive/core/services/data-drive.service';
import { AuthService } from './../../../../../core/services/auth.service';
import { NzModalService } from 'ng-zorro-antd';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DataDrive } from '../../../../../shared/components/data-drive/shared/models';

@Component({
  selector: 'app-task-tabset',
  templateUrl: './task-tabset.component.html',
  styleUrls: ['./task-tabset.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTabsetComponent implements OnInit, OnDestroy {
  empno = this.auth.user.EMPNO;
  dataDriveSub: DataDrive;
  dataDriveNoAssignee: DataDrive;
  dataDriveOutTime: DataDrive;
  dataDriveClosed: DataDrive;
  dataDriveFinished: DataDrive;
  noAssigneeTips = 0;
  normalTips = 0;
  outTimeTips = 0;
  needConfimTips = 0;
  translateTexts = {};
  sub: Subscription;
  sub1: Subscription;
  _project;
  targetHeaderID;
  targetTask;
  @Input()
  set tasksObserver(t: Observable<any[]>) {
    if (t instanceof Observable) {
      this.sub1 = t.subscribe(ts => this.dataDriveSub.selfUpdateTableData(ts));
    }
  }
  @Input() projectPeople: any[];
  @Input() afterDataChange: () => void;
  get isOwner() {
    return this.project && this.project.OWNER === this.empno;
  }
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
    if (this.dataDriveSub) {
      update(this.dataDriveSub);
    }
  }

  get project() {
    return this._project;
  }

  constructor(
    private modalService: NzModalService,
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
        'projectModule.weightSetError',
        'projectModule.taskDetail',
        'projectModule.closeTaskConfirm',
        'projectModule.rollbackTaskConfirm',
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
    if (this.sub1 instanceof Subscription) {
      this.sub1.unsubscribe();
    }
  }

  validateWeight(d: DataDrive) {
    d.beforeUpdateSubmit((fg, sub, ori) => {
      const { WEIGHT } = fg.value,
        ID = ori ? ori.ID : 0,
        HEADER_ID = ori ? ori.HEADER_ID : 0;
      const taskWeight = this.dataDriveSub
        .getData()
        .concat(this.dataDriveClosed.getData())
        .concat(this.dataDriveFinished.getData())
        .concat(this.dataDriveNoAssignee.getData())
        .concat(this.dataDriveOutTime.getData())
        .filter(data => {
          if (ID > 0) {
            const header_id = data.find(_ => _.property === 'HEADER_ID'),
              id = data.find(_ => _.property === 'ID');
            return header_id.value === HEADER_ID && id.value !== ID;
          }
          return true;
        })
        .map(data => data.find(_ => _.property === 'WEIGHT'))
        .filter(data => data)
        .map(data => data.value)
        .reduce((a, b) => {
          a = a || 0;
          const c = +b || 0;
          return a + c;
        }, 0);
      if (WEIGHT > 100 - taskWeight) {
        sub.next(
          this.translateTexts['projectModule.weightSetError']
            ? replaceQuery(
                this.translateTexts['projectModule.weightSetError'],
                {
                  weight: 100 - taskWeight,
                },
              )
            : '',
        );
        return false;
      } else {
        sub.next('');
        return true;
      }
    });
  }
  changeNameSetSub(d: DataDrive) {
    d.changeNameSets({
      actionCol: this.translateTexts['projectModule.actionName'],
      add: this.translateTexts['projectModule.addTask'],
    });
  }

  hideAssigneer(d: DataDrive) {
    let cols = d.tableData.columns;
    d.tableData.columns = cols.filter(c => c.property !== 'ASSIGNER');
  }

  hideStatusTemp(d: DataDrive) {
    d.allHideLists.push('STATUS');
  }

  getUpdateTargetHeaderID(d: DataDrive) {
    if (!this.project) {
      d.onUpdateFormShow((fg, sub, i, data) => {
        const idl = data['HEADER_ID'];
        if (idl) {
          this.targetHeaderID = idl;
        }
      });
    }
  }

  onDownloadExcel(d: DataDrive) {
    d.onDownloadExcel(data => this.projectService.linesOnDownExcel(data));
  }
  getDataDriveSub(d: DataDrive) {
    this.onDownloadExcel(d);
    this.hideStatusTemp(d);
    this.hideAssigneer(d);
    this.validateWeight(d);
    this.changeNameSetSub(d);
    this.filterEmpno(d);
    this.getUpdateTargetHeaderID(d);
    this.dataDriveSub = d;
    if (this.project) {
      d.tableData.addable = d.tableData.editable = d.tableData.deletable = this.isOwner;
    } else {
      d.tableData.addable = false;
      d.tableData.editable = d.tableData.deletable = true;
    }
    d.afterDataInit(() => {
      if (this.project) {
        setTimeout(() => {
          this.updateParent();
        }, 500);
      }
    });
    d.afterDataInit(data => (this.normalTips = data.length));
    d.onUpdateData(data => {
      data.ASSIGNER = this.empno;
      data.STATUS = data.STATUS || 'Open';
      data.HEADER_ID = data.HEADER_ID || (this.project && this.project.ID);
      return data;
    });
    if (this.project) {
      d.beforeSearch(data => {
        data = data || {};
        data.HEADER_ID = this.project.ID;
        return data;
      });
    }
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
                  if (l.ASSIGNEE_LIST && l.ASSIGNEE_LIST.length > 0) {
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
    if (this.project) {
      this.dataDriveService.updateViewData(d);
    }
  }
  getDataDriveSub0(d: DataDrive) {
    this.onDownloadExcel(d);
    this.hideStatusTemp(d);
    this.hideAssigneer(d);
    this.validateWeight(d);
    this.changeNameSetSub(d);
    this.getUpdateTargetHeaderID(d);
    this.filterEmpno(d);
    d.tableData.editable = d.tableData.deletable = this.project
      ? this.isOwner
      : true;
    this.dataDriveNoAssignee = d;
    d.afterDataInit(data => (this.noAssigneeTips = data.length));
    // 组件的设计默认为更新后去重新获取数据，下面禁止此行为
    this.stopInsideUpdate(d);
  }
  getDataDriveSub1(d: DataDrive) {
    this.onDownloadExcel(d);
    this.hideStatusTemp(d);
    this.hideAssigneer(d);
    this.validateWeight(d);
    this.changeNameSetSub(d);
    this.getUpdateTargetHeaderID(d);
    this.filterEmpno(d);
    d.tableData.editable = d.tableData.deletable = this.project
      ? this.isOwner
      : true;
    this.dataDriveOutTime = d;
    d.afterDataInit(data => (this.outTimeTips = data.length));
    this.stopInsideUpdate(d);
  }
  getDataDriveSub2(d: DataDrive) {
    this.onDownloadExcel(d);
    this.hideStatusTemp(d);
    this.hideAssigneer(d);
    this.validateWeight(d);
    this.changeNameSetSub(d);
    this.filterEmpno(d);
    this.dataDriveFinished = d;
    d.afterDataInit(data => (this.needConfimTips = data.length));
    this.stopInsideUpdate(d);
  }
  getDataDriveSub3(d: DataDrive) {
    this.onDownloadExcel(d);
    this.hideStatusTemp(d);
    this.hideAssigneer(d);
    this.validateWeight(d);
    this.changeNameSetSub(d);
    this.filterEmpno(d);
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
    if (this.project) {
      this.dataDriveService.updateViewData(this.dataDriveSub);
    } else {
      this.afterDataChange();
    }
  }
  seeTaskDetail(data) {
    this.targetTask = data;
    const subscription = this.modalService.create({
      nzTitle: this.translateTexts['projectModule.taskDetail'],
      nzContent: TaskDetailComponent,
      nzOnOk() {},
      nzOnCancel() {},
      nzFooter: null,
      nzComponentParams: {
        task: data,
        afterUpdate: () => {
          setTimeout(_ => {
            this.updateParent();
          }, 500);
        },
      },
      nzWidth: '80vw',
    });
    subscription.afterClose.subscribe(_ => (this.targetTask = null));
  }
  closeTask(t) {
    const okCb = () => {
      const dismiss = this.util.showLoading2();
      t.STATUS = 'Closed';
      this.dataDriveService.updateData(this.dataDriveSub, t).subscribe(
        () => {
          this.updateSubData();
          this.updateParent();
          dismiss();
        },
        err => {
          this.util.errDeal(err);
          dismiss();
        },
      );
    };
    this.util.showBisicConfirmModal({
      title: this.translateTexts['projectModule.closeTaskConfirm'],
      okCb,
    });
  }
  rollbackTask(t) {
    const okCb = () => {
      const dismiss = this.util.showLoading2();
      t.STATUS = 'Open';
      this.dataDriveService.updateData(this.dataDriveSub, t).subscribe(
        () => {
          this.updateSubData();
          dismiss();
        },
        err => {
          this.util.errDeal(err);
          dismiss();
        },
      );
    };
    this.util.showBisicConfirmModal({
      title: this.translateTexts['projectModule.rollbackTaskConfirm'],
      okCb,
    });
  }

  updateParent() {
    if (typeof this.afterDataChange === 'function') {
      this.afterDataChange();
    }
  }

  filterEmpno(d: DataDrive) {
    const updateSets = d.updateSets;
    const target = updateSets.find(s => s.property === 'ASSIGNEE_LIST');
    if (target) {
      target.InputOpts = target.InputOpts || {};
      target.InputOpts.more = target.InputOpts.more || {};
      target.InputOpts.more.searchFilter = data => {
        if (isArray(this.projectPeople)) {
          return data.filter(
            e =>
              e.EMPNO === this.project.OWNER ||
              this.projectPeople.find(s => {
                if (isArray(s)) {
                  return s.find(
                    _ => _.property === 'USER_NAME' && _.value === e.EMPNO,
                  );
                }
                return false;
              }),
          );
        } else {
          if (this.targetHeaderID) {
            return this.projectService
              .getProjectPeople(this.targetHeaderID)
              .pipe(
                map((ps: any[]) => {
                  return data.filter(
                    e =>
                      e.EMPNO === this.empno ||
                      ps.find(s => {
                        return s && s.USER_NAME === e.EMPNO;
                      }),
                  );
                }),
              );
          } else {
            return data;
          }
        }
      };
    }
  }
}
