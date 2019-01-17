import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import { DataDrive } from '../../../shared/components/data-drive/shared/models';
import { isNumber } from '../../../shared/utils';
import { UtilService } from '../../../core/services/util.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-cvte',
  templateUrl: './cvte.component.html',
  styleUrls: ['./cvte.component.css'],
})
export class CvteComponent implements OnInit, OnDestroy {
  @ViewChild('mainBody') mainBody: TemplateRef<any>;
  isShowModal;
  lists = [];
  bgColor = ['#e4f724', '#98d65c', '#e4cb24', '#32c0cc'];
  tabIdx = 0;
  sub1: Subscription;
  constructor(private util: UtilService) {}

  ngOnInit() {}
  ngOnDestroy() {
    this.unSubscribe();
  }
  switch() {
    const lg = (this.lists && this.lists.length) || 0;
    if (lg > 1) {
      if (this.tabIdx >= lg - 1) {
        this.tabIdx = 0;
      } else {
        this.tabIdx++;
      }
    }
  }
  getDataDrive(d: DataDrive) {
    setTimeout(() => {
      const view = d.viewerRegister(this.mainBody);
      d.switchViewType(view.type);
      d.additionalFn.switchViewType = null;
    }, 5);
    d.afterDataInit(data => {
      this.lists = data;
    });
    d.setSearchInputDefault('line', 111877);
    d.setSearchInputDefault('operations', 3885);
    d.observeIsShowModal().subscribe(i => {
      this.isShowModal = i;
      if (i) {
        const lg = this.lists.length;
        if (!this.sub1 && lg > 1) {
          const setInterval = d.tableData.refreshDataInterval
            ? +d.tableData.refreshDataInterval / lg
            : 20 * 1000;
          this.sub1 = interval(setInterval).subscribe(() => {
            this.switch();
          });
        }
      } else {
        this.unSubscribe();
      }
    });
  }
  unSubscribe() {
    if (this.sub1 instanceof Subscription) {
      this.sub1.unsubscribe();
      this.sub1 = null;
    }
  }
  getDataDriveItem(d: DataDrive, op: number, data: any) {
    if (this.isShowModal) {
      d.additionalFn.menu = false;
    }
    let body = [];
    const header = data.BODYS1[op] || {};
    header.null = '';
    if (isNumber(header.INPUT_TOTAL_HOURS)) {
      header.INPUT_TOTAL_HOURS = +header.INPUT_TOTAL_HOURS.toFixed(3);
    }
    body.push(header);
    body.push({
      OP_ID: '时间',
      INPUT_TOTAL_HOURS: '标准产量',
      TARGET_QTY: '实际产出',
      OUTPUT_QTY: '达成率',
      FINISH_RATE: '良率',
      null: '不良数量',
      isName: true,
    });
    let subBody: any[] = data.BODYS2[op] || [];
    subBody = subBody.map(s => {
      return {
        OP_ID: s.WORK_TIME ? this.util.dateFormat(s.WORK_TIME, 'HH:mm') : '',
        INPUT_TOTAL_HOURS: s.STANDARD_CAPACITY,
        TARGET_QTY: s.CURRENT_HOUR_OUTPUT,
        OUTPUT_QTY: s.FINISH_RATE,
        FINISH_RATE: s.FIRST_PASS_YIELD_RATE,
        null: s.FAIL_QTY,
      };
    });
    while (subBody.length < 3) {
      subBody.push({ OP_ID: '/' });
    }
    body = body.concat(subBody);
    setTimeout(() => {
      d.selfUpdateTableData(body);
    }, 5);
  }

  getBodyCellStyleFn(idx: number) {
    return (data: any /* 所在行的数据 */, property: string /* 栏位位 */) => {
      if (data.isName) {
        return { 'background-color': this.bgColor[idx] };
      } else {
        return { 'background-color': '#e4f7d6' };
      }
    };
  }
  getHeaderCellStyle(idx) {
    return () => {
      return { 'background-color': this.bgColor[idx] };
    };
  }
}
