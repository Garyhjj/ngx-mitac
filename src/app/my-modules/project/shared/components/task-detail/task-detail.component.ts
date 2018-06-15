import { UtilService } from './../../../../../core/services/util.service';
import { ProjectService } from './../../services/project.service';
import { AuthService } from './../../../../../core/services/auth.service';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import * as moment from 'moment';
import { isArray, sortUtils } from '../../../../../shared/utils';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailComponent implements OnInit {
  _task;
  @Input()
  set task(t) {
    if (t.hasOwnProperty('STATUS')) {
      this.getProgress(t.ID);
      this.getComments(t.ID);
      this._task = t;
    } else {
      const loadingID = this.util.showLoading();
      const final = () => this.util.dismissLoading(loadingID);
      this.projectService.getProjecLine(t.ID).subscribe(
        ts => {
          const t1 = ts[0];
          this._task = ts[0];
          this.getProgress(t1.ID);
          this.getComments(t1.ID);
          final();
        },
        err => {
          this.util.errDeal(err);
          final();
        },
      );
    }
  }
  @Input() afterUpdate: () => void;

  get task() {
    return this._task;
  }

  progressList = [];
  replyTo;
  isCommentVisible;
  empno = this.auth.user.EMPNO;
  comments: {
    USER_NAME: string;
    CONTENT: string;
    CREATION_DATE: Date;
    REPLY_TO: string;
  }[];

  get isAssigner() {
    return this._task && this._task.ASSIGNEE === this.empno;
  }

  constructor(
    private ref: ChangeDetectorRef,
    private auth: AuthService,
    private projectService: ProjectService,
    private util: UtilService,
  ) {}

  ngOnInit() {}

  getProgress(line_id) {
    const dismiss = this.util.showLoading2();
    this.projectService.getTaskProgress(line_id).subscribe(
      (s: any[]) => {
        if (isArray(s)) {
          let map = Object.create(null);
          s.forEach(l => {
            const date = moment(l.CREATION_DATE).format('YYYY-MM-DD');
            map[date] = map[date] || [];
            map[date].push(l);
          });
          const p = [];
          // tslint:disable-next-line:forin
          for (let prop in map) {
            p.push({ date: prop, list: map[prop] });
          }
          this.progressList = p.sort((a, b) =>
            sortUtils.byDate(a.date, b.date),
          );
        }
        this.ref.markForCheck();
        dismiss();
      },
      err => {
        this.util.errDeal(err);
        dismiss();
      },
    );
  }

  updateProgress(v: string) {
    const dismiss = this.util.showLoading2();
    let nowDate = moment().format('YYYY-MM-DD');
    const LINE_ID = this.task.ID;
    const send = { LINE_ID, CONTENT: v, HEADER_ID: this.task.HEADER_ID };
    this.projectService.updateTaskProgress(send).subscribe(
      res => {
        this.getProgress(LINE_ID);
        this.doAfterUpdate();
        dismiss();
      },
      err => {
        this.util.errDeal(err);
        dismiss();
      },
    );
  }
  getComments(line_id) {
    this.projectService.getTaskComments(line_id).subscribe(
      (cs: any[]) => {
        this.comments = cs;
        this.ref.markForCheck();
      },
      err => {
        this.util.errDeal(err);
      },
    );
  }

  updateComment(comment) {
    const dismiss = this.util.showLoading2();
    this.projectService
      .updateTaskComments({
        LINE_ID: this.task.ID,
        USER_NAME: this.empno,
        CONTENT: comment,
        REPLY_TO: this.replyTo,
        HEADER_ID: this.task.HEADER_ID,
      })
      .subscribe(
        res => {
          this.isCommentVisible = false;
          this.getComments(this.task.ID);
          this.doAfterUpdate();
          this.ref.markForCheck();
          dismiss();
        },
        err => {
          this.util.errDeal(err);
          dismiss();
        },
      );
    this.replyTo = null;
  }
  trackByID(index, item) {
    if (typeof item === 'object') {
      return item.ID;
    }
  }

  doAfterUpdate() {
    if (typeof this.afterUpdate === 'function') {
      this.afterUpdate();
    }
  }
}
