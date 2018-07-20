import { TableDataColumn } from './../../../shared/components/data-drive/shared/models/table-data/index';
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
    let color =
        data.ATTRIBUTE9 > 0 ? 'red' : data.ATTRIBUTE10 > 0 ? 'yellow' : 'green',
      padding = '16px 6px',
      style = {
        color,
        padding,
        ['min-width']:
          property === 'PN_NUMBER'
            ? '175px'
            : property.startsWith('DAY')
              ? '86px'
              : 'none',
      };
    return style;
  };

  headerCellStyle = (c: TableDataColumn) => {
    let padding = '16px 6px',
      property = c.property,
      style = {
        padding,
        ['min-width']:
          property === 'PN_NUMBER'
            ? '175px'
            : property.startsWith('DAY')
              ? '86px'
              : 'none',
      };
    return style;
  };
  constructor() {}

  ngOnInit() {}

  getDrive(d: DataDrive) {
    d.beforeInitTableData(ls => {
      const m = moment().get('day');
      if (ls.length > 0) {
        let startDate = ls[0].WEEK_START_DATE;
        if (startDate) {
          ls = ls.filter(l => l.WEEK_START_DATE === startDate);
        } else {
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
          let all = 0,
            beforeNow = 0;
          let dayBefore = m + 1 > 7 ? m + 1 - 7 : m + 1;
          for (let i = 1; i < 8; i++) {
            let dayData = data['DAY' + i];
            data['DAY' + i] = isNumber(dayData) ? +dayData : 0;
            all += data['DAY' + i];
            if (i <= dayBefore) {
              beforeNow += data['DAY' + i];
            }
          }
          const finish = g + sendQty;
          data.ATTRIBUTE10 = all - finish;
          data.ATTRIBUTE9 = beforeNow - finish;
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
          // TODO: 把红色的排在前面
          aAch = a.ATTRIBUTE9 > 0 ? +aAch - 100 : aAch;
          bAch = b.ATTRIBUTE9 > 0 ? +bAch - 100 : bAch;
          const res = aAch - bAch;
          return res;
        });
    });
  }
}
