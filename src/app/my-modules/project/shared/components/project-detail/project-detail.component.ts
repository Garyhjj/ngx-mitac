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
import { nbind } from 'q';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  history;
  empno = this.auth.user.EMPNO;
  dataDrivePeople: DataDrive;
  loadingMore;
  page = 1;
  _project;
  targetTask;
  isHistoryFold = true;
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
    if (this.dataDrivePeople) {
      update(this.dataDrivePeople);
    }
  }
  translateTexts = {};
  sub: Subscription;
  get peopleList() {
    if (this.dataDrivePeople) {
      return this.dataDrivePeople.getData();
    } else {
      return [];
    }
  }
  get project() {
    return this._project;
  }

  get isOwner() {
    return this.project && this.project.OWNER === this.empno;
  }

  afterTaskTabChange = () => {
    this.getHistory(this.project.ID);
    this.updateParent();
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
      .stream(['projectModule.actionName', 'projectModule.addPerson'])
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
    d.afterDataInit(data => {
      setTimeout(() => {
        this.getHistory(this.project.ID);
      }, 500);
    });
    this.dataDriveService.updateViewData(d);
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

  /**
   * 生成页面历史记录中附件变化的内容
   *
   * @param {string[]} now
   * @param {string[]} before
   * @param {number} type
   * @returns
   * @memberof ProjectDetailComponent
   */
  getAttachemntChangeDetail(now: string[], before: string[], type: number) {
    now = isArray(now) ? now : [];
    before = isArray(before) ? before : [];
    if (type === 1) {
      const addOne = now.filter(n => before.indexOf(n) < 0);
      return addOne.length > 0 ? addOne : null;
    } else {
      const deleteOne = before.filter(b => now.indexOf(b) < 0);
      return deleteOne.length > 0 ? deleteOne : null;
    }
  }
}
