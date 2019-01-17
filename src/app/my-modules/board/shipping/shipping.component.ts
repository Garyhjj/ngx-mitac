import { TabelViewSet } from './../../../shared/components/data-drive/shared/models/viewer/table';
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
  dataDrive: DataDrive;
  _dataWeekStartDate;
  bodySetStyle = (
    data: any /* 所在行的数据 */,
    property: string /* 栏位位 */,
  ) => {
    let color =
        data.ATTRIBUTE9 > 0
          ? 'red'
          : data.ATTRIBUTE10 > 0
            ? 'yellow'
            : typeof data.ATTRIBUTE10 === 'number'
              ? 'green'
              : 'white',
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
  set dataWeekStartDate(date) {
    if (date !== this._dataWeekStartDate) {
      this._dataWeekStartDate = date;
      const d = this.dataDrive;
      d.tableData.columns = d.tableData.columns.map(c => {
        if (c.property.startsWith('DAY')) {
          const dayN = +c.property.slice(3);
          c.value = moment(date)
            .add(dayN - 1, 'day')
            .format('M/D ddd');
        }
        return c;
      });
      d.selfHideLists = d.selfHideLists;
    }
  }
  constructor() {}

  ngOnInit() {}

  getDrive(d: DataDrive) {
    this.dataDrive = d;
    let tableView = d.dataViewSet as TabelViewSet;
    tableView.onScrollTo(data => {
      if (data.hasOwnProperty('ATTRIBUTE9')) {
        this.dataWeekStartDate = data.WEEK_START_DATE;
      }
    });
    d.beforeInitTableData((ls: any[]) => {
      ls.sort((a, b) => sortUtils.byDate(a.WEEK_START_DATE, b.WEEK_START_DATE));
      ls = ls.map(data => {
        const g = isNumber(data.AVAILABLE_QTY) ? +data.AVAILABLE_QTY : 0,
          sendQty = isNumber(data.SENT_QTY) ? +data.SENT_QTY : 0;
        let all = 0,
          beforeNow = 0;
        for (
          let i = 1,
            max =
              (new Date().getTime() -
                new Date(data.WEEK_START_DATE).getTime()) /
              (1000 * 60 * 60 * 24);
          i < 8;
          i++
        ) {
          let dayData = data['DAY' + i];
          data['DAY' + i] = isNumber(dayData) ? +dayData : 0;
          all += data['DAY' + i];
          if (i < max) {
            beforeNow += data['DAY' + i];
          }
        }
        const finish = g + sendQty;
        data.ATTRIBUTE10 = all - finish;
        data.ATTRIBUTE9 = beforeNow - finish;
        return data;
      });
      let aparts = {};
      for (let i = 0, lg = ls.length - 1; i < lg; i++) {
        const tar = ls[i];
        const startDate = moment(tar.WEEK_START_DATE).format('YYYY-MM-DD');
        aparts[startDate] = aparts[startDate] || [];
        aparts[startDate].push(tar);
      }
      let newLs = [];
      const columns = d.tableData.columns;
      // tslint:disable-next-line:forin
      for (let prop in aparts) {
        aparts[prop].sort((a, b) => this.mySort(a, b));
        let list = aparts[prop];
        if (newLs.length > 0) {
          let nameDefine = Object.create(null);
          columns.forEach(c => {
            let val = c.value;
            const property = c.property;
            if (property.startsWith('DAY')) {
              let startDate = list[0].WEEK_START_DATE;
              const dayN = +property.slice(3);
              val = this.getDayFormat(startDate, property);
            }
            nameDefine[property] = val;
          });
          list.unshift(nameDefine);
        }
        newLs = newLs.concat(list);
      }
      if (ls.length > 0) {
        let startDate = ls[0].WEEK_START_DATE;
        this.dataWeekStartDate = startDate;
      }
      return newLs;
    });
  }

  getDayFormat(startDate: string, property: string) {
    const dayN = +property.slice(3);
    return moment(startDate)
      .add(dayN - 1, 'day')
      .format('M/D ddd');
  }

  mySort(a, b) {
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
  }
}
