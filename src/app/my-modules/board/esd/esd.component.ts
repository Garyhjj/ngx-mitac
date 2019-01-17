import { boardConfig } from './../shared/config/index';
import { DataDrive } from './../../../shared/components/data-drive/shared/models/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BoardService } from '../shared/services/board.service';
import { UtilService } from '../../../core/services/util.service';
import { APPConfig } from '../../../shared/config/app.config';
import { isArray } from '../../../shared/utils/index';
import * as schedule from 'node-schedule';
@Component({
  selector: 'app-esd',
  templateUrl: './esd.component.html',
  styleUrls: ['./esd.component.css'],
})
export class EsdComponent implements OnInit, OnDestroy {
  date = this.util.dateFormat(new Date(), 'YYYY-MM-DD');

  notPassQuantity = 0;
  passQuantity = 0;

  validateForm: FormGroup;

  dataDrive: DataDrive;

  lazyTopAPI = boardConfig.getTopDep.replace(APPConfig.baseUrl, '');
  checkBoxOptions;

  cache: any = {};

  cacheName;
  targetSubList: string[] = [];
  sub1: Subscription;
  constructor(
    private boardService: BoardService,
    private util: UtilService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.initForm();
    this.lazyChangeSubOptions();
    this.updateHeaderMes();
    schedule.scheduleJob('0 0 * * *', () => {
      this.date = this.util.dateFormat(new Date(), 'YYYY-MM-DD HH:mm');
    });
  }
  ngOnDestroy() {
    // tslint:disable-next-line:no-unused-expression
    this.sub1 && this.sub1.unsubscribe();
  }

  updateHeaderMes(bu_deptno?: string, chu_deptno?: string) {
    forkJoin(
      this.boardService.getEsdQuantity('N', bu_deptno, chu_deptno),
      this.boardService.getEsdQuantity('Y', bu_deptno, chu_deptno),
    ).subscribe(
      a => {
        this.notPassQuantity = (a[0] as number) || 0;
        this.passQuantity = (a[1] as number) || 0;
      },
      err => this.util.errDeal(err),
    );
  }

  lazyChangeSubOptions() {
    this.validateForm
      .get('top')
      .valueChanges.pipe(
        concatMap(c => {
          this.targetSubList = [];
          this.validateForm.get('sub').setValue('');
          this.cacheName = c;
          return this.boardService.getSubDep(c);
        }),
      )
      .subscribe(a => {
        const list = a as any[];
        if (isArray(list)) {
          this.checkBoxOptions = list.map(d => {
            this.targetSubList.push(d.CHU_DEPTNO);
            return { value: d.CHU_NAME, property: d.CHU_DEPTNO };
          });
          this.cache[this.cacheName] = this.targetSubList.slice();
        }
      });
  }

  initForm() {
    this.validateForm = this.fb.group({
      top: [''],
      sub: [''],
    });
  }
  getDrive(d: DataDrive) {
    this.dataDrive = d;
    this.dataDrive.canAutoUpdate = false;
    this.sub1 = this.dataDrive
      .observeScrollToBottom()
      .subscribe(() => this.submitForm());
  }
  _onReuseDestroy() {
    this.dataDrive.runIntoBackground();
  }
  _onReuseInit() {
    this.dataDrive.backIntoFront();
  }

  submitForm() {
    const value = this.validateForm.value;
    const list = value['sub'];
    const top = value['top'];
    this.updateHeaderMes(top, list);
    if (list) {
      this.targetSubList = list.split(',');
    } else {
      this.targetSubList = this.cache[top];
    }
    if (this.targetSubList && this.targetSubList.length > 0) {
      let req = [];
      this.targetSubList.forEach(s =>
        req.push(this.boardService.getEsdNotPassList(s)),
      );
      forkJoin(...req).subscribe(res => {
        let all = [];
        res.forEach(r => {
          if (isArray(r)) {
            all = all.concat(r);
          }
        });
        this.dataDrive.selfUpdateTableData(all);
      });
    } else {
      this.boardService
        .getEsdNotPassList('')
        .subscribe(d => this.dataDrive.selfUpdateTableData(d));
    }
  }

  reSet() {
    this.targetSubList = [];
    // tslint:disable-next-line:no-unused-expression
    this.validateForm && this.validateForm.reset();
  }
}
