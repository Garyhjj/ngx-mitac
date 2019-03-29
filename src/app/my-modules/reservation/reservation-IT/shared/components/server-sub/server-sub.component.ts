import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilService } from './../../../../../../core/services/util.service';
import { AuthService } from './../../../../../../core/services/auth.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DataDrive } from '../../../../../../shared/components/data-drive/shared/models';
import { Observable, Subscription, timer } from 'rxjs';
import { ReservationApplication } from '../../models';
import { NzModalService } from 'ng-zorro-antd';
import { NgxValidatorExtendService } from '../../../../../../core/services/ngx-validator-extend.service';
import { ReservationITService } from '../../services/reservaton-IT.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-server-sub',
  templateUrl: './server-sub.component.html',
  styleUrls: ['./server-sub.component.css'],
})
export class ServerSubComponent implements OnInit, OnDestroy {
  @Input() dataChange: Observable<any[]>;
  d2: DataDrive;
  d3: DataDrive;
  sub: Subscription;
  subList = new Set();
  user = this.auth.user;
  yinxiangText: string;
  confirmToAccept: string;
  confirmToReset: string;
  isClosedVisible = false;
  isDoneVisible = false;
  reason: string;
  closedTarget: ReservationApplication;
  doneTarget: ReservationApplication;
  doneForm: FormGroup;

  constructor(
    private auth: AuthService,
    private modalService: NzModalService,
    private util: UtilService,
    private fb: FormBuilder,
    private validatorExtendService: NgxValidatorExtendService,
    private itSre: ReservationITService,
    private translateService: TranslateService,
    ) {}

  ngOnInit() {
    this.translateService
      .get([
        'serviceModule.yinxiang2',
        'serviceModule.confirmToAccept',
        'serviceModule.confirmToReset',
      ])
      .subscribe(data => {
        // console.log(data);
        this.yinxiangText = data['serviceModule.yinxiang2'];
        this.confirmToAccept = data['serviceModule.confirmToAccept'];
        this.confirmToReset = data['serviceModule.confirmToReset'];
      });
  }

  ngOnDestroy() {
    Array.from(new Set()).forEach((_: Subscription) => {
      // tslint:disable-next-line:no-unused-expression
      _ && _.unsubscribe();
    });
  }

  obData(d: DataDrive) {
    this.sub = this.dataChange.subscribe(list => d.selfUpdateTableData(list));
    this.subList.add(this.sub);
  }

  hideColumns(d: DataDrive) {
    const hideList = [
      'REMARK',
      'TYPE',
      'HANDLE_TIME',
      'SCORE',
      'USER_COMMENT',
      'impression',
    ];
    d.tableData.columns = d.tableData.columns.filter(
      c => hideList.indexOf(c.property) < 0,
    );
  }

  getDataDrive1(d: DataDrive) {
    this.hideColumns(d);
    d.beforeInitTableData(res => {
      const newList = [],
        myTask = [],
        others = [];
      res.forEach(l => {
        const { STATUS: status } = l;
        if (status === 'New') {
          newList.push(l);
        } else {
          if (l.HANDLER !== this.user.EMPNO) {
            others.push(l);
          } else {
            myTask.push(l);
          }
        }
      });
      this.d2.selfUpdateTableData(myTask);
      this.d3.selfUpdateTableData(others);
      return newList;
    });
    timer(10).subscribe(() => this.obData(d));
  }

  getDataDrive2(d: DataDrive) {
    this.hideColumns(d);
    this.d2 = d;
  }
  getDataDrive3(d: DataDrive) {
    this.hideColumns(d);
    this.d3 = d;
  }

  receiveResvation(data: ReservationApplication) {
    const doReceive = () => {
      const send = Object.assign({}, data, {
        STATUS: 'Processing',
        HANDLER: this.itSre.user.EMPNO,
      });
      this.updateService(send);
    };
    this.modalService.confirm({
      nzTitle: this.confirmToAccept,
      nzOnOk() {
        doReceive();
      },
      nzOnCancel() {},
    });
  }

  updateService(data: ReservationApplication, succ?: () => void) {
    const loadingID = this.util.showLoading();
    const final = () => this.util.dismissLoading(loadingID);
    this.itSre.updateService(data).subscribe(
      () => {
        final();
        // tslint:disable-next-line:no-unused-expression
        succ && succ();
        this.itSre.callForWholeUpdate();
      },
      err => {
        this.util.errDeal(err);
        final();
      },
    );
  }

  closeResvation(data: ReservationApplication) {
    this.isClosedVisible = true;
    this.closedTarget = data;
  }

  doneResvation(data: ReservationApplication) {
    this.doneForm = null;
    this.isDoneVisible = true;
    this.doneForm = this.fb.group({
      TYPE: [null, this.validatorExtendService.required()],
      HANDLE_TIME: [undefined, this.validatorExtendService.required()],
      REMARK: [''],
    });
    this.doneTarget = data;
    // this.modalService.confirm({
    //   title: '您確定要處理嗎？',
    //   onOk() {
    //     doDone();
    //   },
    //   onCancel() {
    //   }
    // });
  }

  submitDoneForm() {
    const val = this.doneForm.value;
    const alter = Object.assign({}, val, {
      STATUS: 'Scoring',
      PROCESS_TIME: this.util.dateFormat(new Date(), 'YYYY-MM-DDT HH:mm:ss'),
    });
    const doDone = () => {
      const send = Object.assign({}, this.doneTarget, alter);
      this.updateService(send, () => {
        this.isDoneVisible = false;
        this.doneForm = null;
      });
    };
    doDone();
  }

  resetResvation(data: ReservationApplication) {
    const doReset = () => {
      const send = Object.assign({}, data, {
        STATUS: 'New',
        HANDLER: '',
        RESET_FLAG: 'Y',
      });
      this.updateService(send);
    };
    this.modalService.confirm({
      nzTitle: this.confirmToReset,
      nzOnOk() {
        doReset();
      },
      nzOnCancel() {},
    });
  }
}
