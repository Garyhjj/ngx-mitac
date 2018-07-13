import { sortUtils, isNumber } from './../../../shared/utils/index';
import { DataDrive } from './../../../shared/components/data-drive/shared/models/index';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css'],
})
export class ShippingComponent implements OnInit {
  bodySetStyle = (
    data: any /* 所在行的数据 */,
    property: string /* 栏位位 */,
  ) => {
    if (data.ATTRIBUTE10 > 0) {
      return {
        color: 'yellow',
      };
    } else {
      return {
        color: 'green',
      };
    }
  };
  constructor() {}

  ngOnInit() {}

  getDrive(d: DataDrive) {
    d.beforeInitTableData(ls => {
      if (ls.length > 0) {
        let startDate = ls[0].WEEK_START_DATE;
        if (startDate) {
          ls = ls.filter(l => l.WEEK_START_DATE === startDate);
        } else {
          const m = moment().get('day');
          startDate = m === 6 ? moment() : moment().weekday(-6);
        }
        d.tableData.columns = d.tableData.columns.map(c => {
          if (c.property.startsWith('DAY')) {
            const dayN = +c.property.slice(3);
            c.value = moment(startDate)
              .add(dayN - 1, 'day')
              .format('M/D ddd');
          }
          return c;
        });
        d.selfHideLists = d.selfHideLists;
      }
      return ls
        .map(data => {
          const g = isNumber(data.AVAILABLE_QTY) ? +data.AVAILABLE_QTY : 0,
            sendQty = isNumber(data.SENT_QTY) ? +data.SENT_QTY : 0;
          let all = 0;
          for (let i = 1; i < 8; i++) {
            let dayData = data['DAY' + i];
            data['DAY' + i] = isNumber(dayData) ? +dayData : 0;
            all += data['DAY' + i];
          }
          data.ATTRIBUTE10 = all - (g + sendQty);
          return data;
        })
        .sort((a, b) => {
          let aAch = a.ACH,
            bAch = b.ACH;
          if (aAch === null || aAch === '' || aAch === void 0) {
            aAch = 1000;
          } else {
            aAch = aAch + '';
            a.ACH =
              typeof aAch === 'string' && aAch.indexOf('.') > -1
                ? Number(aAch).toFixed(2)
                : aAch;
          }
          if (bAch === null || bAch === '' || bAch === void 0) {
            bAch = 1000;
          } else {
            bAch = bAch + '';
            b.ACH =
              typeof bAch === 'string' && bAch.indexOf('.') > -1
                ? Number(bAch).toFixed(2)
                : bAch;
          }
          const res = aAch - bAch;
          return res;
        });
    });
  }
}
