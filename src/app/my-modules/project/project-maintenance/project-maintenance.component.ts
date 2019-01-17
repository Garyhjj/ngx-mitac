import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd';
import { UtilService } from './../../../core/services/util.service';
import { ProjectService } from './../shared/services/project.service';
import { DataDriveService } from './../../../shared/components/data-drive/core/services/data-drive.service';
import { AuthService } from './../../../core/services/auth.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { DataDrive } from '../../../shared/components/data-drive/shared/models';
import { ProjectTreeComponent } from '../shared/components/project-tree/project-tree.component';
import { Project } from '../shared/models';
import { isArray } from '../../../shared/utils';

@Component({
  selector: 'app-project-maintenance',
  templateUrl: './project-maintenance.component.html',
  styleUrls: ['./project-maintenance.component.css'],
})
export class ProjectMaintenanceComponent implements OnInit, OnDestroy {
  targetProject;
  openDataDrive: DataDrive;
  outTimeDataDrive: DataDrive;
  finishDataDrive: DataDrive;
  normalTips = 0;
  outTimeTips = 0;
  isSetParentVisible = false;
  parentOpts = [];
  parentVal;
  projectForSetParent;
  translateTexts = {};
  sub: Subscription;
  @ViewChild('detialView') detailView: ElementRef;
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
    private util: UtilService,
    private modalService: NzModalService,
    private translateService: TranslateService,
  ) {}

  getTranslation() {
    this.sub = this.translateService
      .stream([
        'projectModule.actionName',
        'projectModule.addProject',
        'projectModule.closeProjectConfirm',
        'projectModule.clearParent',
        'projectModule.routeNet',
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
  changeNameSet(d: DataDrive) {
    d.changeNameSets({
      actionCol: this.translateTexts['projectModule.actionName'],
      add: this.translateTexts['projectModule.addProject'],
    });
  }

  getDataDrive1(d: DataDrive) {
    this.changeNameSet(d);
    d.tableData.addable = true;
    d.tableData.editable = true;
    d.tableData.deletable = true;
    this.openDataDrive = d;
    d.beforeInsideUpdateView(() => {
      setTimeout(_ => {
        if (this.targetProject) {
          this.targetProject = Object.assign({}, this.targetProject);
        }
      }, 400);
    });
    d.onUpdateData(data => {
      data.OWNER = this.auth.user.EMPNO;
      data.STATUS = data.STATUS || 'Open';
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
    this.changeNameSet(d);
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
    this.changeNameSet(d);
    d.tableData.searchable = true;
    if (isArray(d.searchSets)) {
      d.searchSets = d.searchSets.filter(s => s.property !== 'OWNER');
    }
    d.beforeSearch(data => {
      data = data || {};
      data.status = 'Closed';
      return data;
    });
  }

  seeDetail(d) {
    this.targetProject = d;
    setTimeout(() => {
      try {
        this.detailView.nativeElement.scrollIntoView();
      } catch (e) {}
    }, 100);
  }

  closeProject(d) {
    const okCb = () => {
      const dismiss = this.util.showLoading2();
      this.dataDriveService
        .updateData(
          this.openDataDrive,
          Object.assign({}, d, {
            STATUS: 'Closed',
          }),
        )
        .subscribe(
          () => {
            this.dataDriveService.updateViewData(this.openDataDrive);
            dismiss();
          },
          err => {
            this.util.errDeal(err);
            dismiss();
          },
        );
    };
    this.util.showBisicConfirmModal({
      title: this.translateTexts['projectModule.closeProjectConfirm'],
      okCb,
    });
  }

  seeItTree(project) {
    project.title = project;
    project.key = project.ID;
    const dismiss = this.util.showLoading2();
    this.projectService.getProjectChildren(project.CODE).subscribe(
      res => {
        this.showProjectTree(Object.assign(project, { children: res }));
        dismiss();
      },
      err => {
        this.util.errDeal(err);
        dismiss();
      },
    );
  }

  showProjectTree(tree) {
    const subscription = this.modalService.create({
      nzTitle: this.translateTexts['projectModule.routeNet'],
      nzContent: ProjectTreeComponent,
      nzOnOk() {},
      nzOnCancel() {},
      nzFooter: null,
      nzComponentParams: {
        tree,
        isInModal: true,
      },
      nzWidth: '680px',
    });
  }

  showSetParent(project: Project) {
    this.isSetParentVisible = true;
    this.projectForSetParent = project;
    this.parentVal = project.PARENT_HEADER ? project.PARENT_HEADER : null;
    const id = project.ID;
    this.parentOpts = [];
    const dismiss = this.util.showLoading2();
    this.projectService.getAllProject().subscribe(
      (res: any[]) => {
        const options = res.filter(
          l => l.ID !== id && l.ID !== project.PARENT_HEADER,
        );
        const childrenIDList = new Set();
        const getChildrenIDList = parentID => {
          const children = options
            .filter(l => l.PARENT_HEADER === parentID)
            .map(l => {
              childrenIDList.add(l.ID);
              return l.ID;
            });
          if (children.length > 0) {
            children.forEach(l => {
              getChildrenIDList(l);
            });
          }
        };
        getChildrenIDList(id);
        const canSelectOpts = options
          .filter(l => !childrenIDList.has(l.ID))
          .map(l => {
            const out = { property: l.ID, value: l.NAME + ' ' + l.OWNER };
            return out;
          });
        canSelectOpts.unshift({
          property: -1,
          value: this.translateTexts['projectModule.clearParent'],
        });
        this.parentOpts = canSelectOpts;
        dismiss();
      },
      err => {
        this.util.errDeal(err);
        dismiss();
      },
    );
  }
  setParent() {
    const dismiss = this.util.showLoading2();
    this.projectService
      .setProjectHeader({
        ID: this.projectForSetParent.ID,
        PARENT_HEADER: this.parentVal ? this.parentVal : '',
        CODE: this.projectForSetParent.CODE,
        LAST_UPDATED_DATE: this.projectForSetParent.LAST_UPDATED_DATE,
      })
      .subscribe(
        res => {
          this.afterTasksBigChange();
          setTimeout(_ => {
            if (this.targetProject) {
              this.targetProject = Object.assign({}, this.targetProject);
            }
          }, 400);
          this.isSetParentVisible = false;
          dismiss();
        },
        err => {
          this.util.errDeal(err);
          dismiss();
        },
      );
  }
}
