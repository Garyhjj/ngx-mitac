import { replaceQuery } from './../../../../../shared/utils/index';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from './../../../../../core/services/util.service';
import { ProjectService } from './../../services/project.service';
import { DataDriveService } from './../../../../../shared/components/data-drive/core/services/data-drive.service';
import { TaskDetailComponent } from './../task-detail/task-detail.component';
import { DataDrive } from './../../../../../shared/components/data-drive/shared/models/index';
import { NzModalService } from 'ng-zorro-antd';
import { AuthService } from './../../../../../core/services/auth.service';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { isArray } from '../../../../../shared/utils';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  history;
  empno = this.auth.user.EMPNO;
  dataDriveSub: DataDrive;
  dataDrivePeople: DataDrive;
  dataDriveNoAssignee: DataDrive;
  dataDriveOutTime: DataDrive;
  dataDriveClosed: DataDrive;
  dataDriveFinished: DataDrive;
  noAssigneeTips = 0;
  normalTips = 0;
  outTimeTips = 0;
  needConfimTips = 0;
  loadingMore;
  page = 1;
  _project;
  targetTask;
  @Input() afterBigChange: () => void;
  @Input()
  set project(p) {
    this._project = p;
    this.page = 1;
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
  translateTexts = {};
  sub: Subscription;

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
    private util: UtilService,
    private ref: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {}

  getTranslation() {
    this.sub = this.translateService
      .stream([
        'projectModule.actionName',
        'projectModule.addTask',
        'projectModule.addPerson',
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
  }

  validateWeight(d: DataDrive) {
    d.beforeUpdateSubmit((fg, sub, ori) => {
      const { WEIGHT } = fg.value;
      const ID = ori ? ori.ID : 0;
      const taskWeight = this.dataDriveSub
        .getData()
        .concat(this.dataDriveClosed.getData())
        .concat(this.dataDriveFinished.getData())
        .concat(this.dataDriveNoAssignee.getData())
        .concat(this.dataDriveOutTime.getData())
        .filter(data => {
          const id = data.find(_ => _.property === 'ID');
          if (id) {
            return id.value !== ID;
          }
          return true;
        })
        .map(data => data.find(_ => _.property === 'WEIGHT'))
        .filter(data => data)
        .map(data => data.value)
        .reduce((a, b) => {
          a = a || 0;
          b = b || 0;
          return a + b;
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

  changeNameSetPeople(d: DataDrive) {
    d.changeNameSets({
      actionCol: this.translateTexts['projectModule.actionName'],
      add: this.translateTexts['projectModule.addPerson'],
    });
  }
  getHistory(id, page = 1, succFn?: (res) => void, errFn?: (err) => void) {
    const dismiss = this.util.showLoading2();
    this.projectService.getProjectHistory(id, page).subscribe(
      (res: any[]) => {
        let history: any[] = this.history;
        if (
          isArray(history) &&
          history.length > 0 &&
          history[0].HEADER_ID === id
        ) {
          if (page === 1) {
            history = res.concat(history);
          } else {
            history = history.concat(res);
          }
          this.history = history.filter(
            (h, idx) => history.findIndex(t => t.ID === h.ID) === idx,
          );
        } else {
          this.history = res;
        }
        dismiss();
        // tslint:disable-next-line:no-unused-expression
        succFn && succFn(res);
        this.ref.markForCheck();
      },
      err => {
        this.util.errDeal(err);
        dismiss();
        // tslint:disable-next-line:no-unused-expression
        errFn && errFn(err);
        this.ref.markForCheck();
      },
    );
  }

  getDataDrivePeople(d: DataDrive) {
    this.changeNameSetPeople(d);
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
    d.afterDataInit(() => {
      setTimeout(() => {
        this.getHistory(this.project.ID);
      }, 500);
    });
    this.dataDriveService.updateViewData(d);
  }

  getDataDriveSub(d: DataDrive) {
    this.validateWeight(d);
    this.changeNameSetSub(d);
    this.filterEmpno(d);
    this.dataDriveSub = d;
    d.tableData.addable = d.tableData.editable = d.tableData.deletable = this.isOwner;
    d.onUpdateData(data => {
      data.HEADER_ID = this.project.ID;
      return data;
    });
    d.afterDataInit(() => {
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
    this.validateWeight(d);
    this.changeNameSetSub(d);
    this.filterEmpno(d);
    d.tableData.editable = d.tableData.deletable = this.isOwner;
    this.dataDriveNoAssignee = d;
    d.afterDataInit(data => (this.noAssigneeTips = data.length));
    this.stopInsideUpdate(d);
  }
  getDataDriveSub1(d: DataDrive) {
    this.validateWeight(d);
    this.changeNameSetSub(d);
    this.filterEmpno(d);
    d.tableData.editable = d.tableData.deletable = this.isOwner;
    this.dataDriveOutTime = d;
    d.afterDataInit(data => (this.outTimeTips = data.length));
    this.stopInsideUpdate(d);
  }
  getDataDriveSub2(d: DataDrive) {
    this.validateWeight(d);
    this.changeNameSetSub(d);
    this.filterEmpno(d);
    this.dataDriveFinished = d;
    d.afterDataInit(data => (this.needConfimTips = data.length));
    this.stopInsideUpdate(d);
  }
  getDataDriveSub3(d: DataDrive) {
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
    this.dataDriveService.updateViewData(this.dataDriveSub);
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
            this.getHistory(this.project.ID);
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
    if (typeof this.afterBigChange === 'function') {
      this.afterBigChange();
    }
  }

  onLoadMore() {
    this.loadingMore = true;
    const history = this.history;
    this.page = isArray(history) ? Math.floor(history.length / 5) : 0;
    this.getHistory(
      this.project.ID,
      ++this.page,
      res => {
        this.loadingMore = false;
      },
      () => {
        this.loadingMore = false;
      },
    );
  }

  filterEmpno(d: DataDrive) {
    const updateSets = d.updateSets;
    const target = updateSets.find(s => s.property === 'ASSIGNEE');
    if (target) {
      target.InputOpts = target.InputOpts || {};
      target.InputOpts.more = target.InputOpts.more || {};
      target.InputOpts.more.searchFilter = data => {
        return data.filter(
          e =>
            e.EMPNO === this.project.OWNER ||
            this.dataDrivePeople.getData().find(s => {
              if (isArray(s)) {
                return s.find(
                  _ => _.property === 'USER_NAME' && _.value === e.EMPNO,
                );
              }
              return false;
            }),
        );
      };
    }
  }
}
