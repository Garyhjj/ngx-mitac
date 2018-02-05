import { DataDrive } from './../../shared/models/index';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-exam-paper',
  templateUrl: './exam-paper.component.html',
  styleUrls: ['./exam-paper.component.css']
})
export class ExamPaperComponent implements OnInit {

  @Input() opts: DataDrive;
  @Input() isModal;

  _header: { title: string, name: string, time: number, passScore: number };
  @Input()
  set header(f) {
    if (typeof f === 'object') {
      this._header = f;
    }
  };

  status: number//1 配置中，2 考試前，3 考試中，4.考試后
  beginTime: Date;
  examTime: number = 25;
  leftTime: string;
  TFList = [];
  radioList = [];
  checkboxList = [];
  prefixMain: any = {};
  subTitlePrefixs = ['一', '二', '三', '四'];
  markSets: any = {};
  constructor() { }

  ngOnInit() {
    this.beginTime = new Date();
    this.checkLeftTime();
    if (this.opts) {
      this.status = 1;
      this.opts.afterDataInit(() => {
        transform();
      })
      const transform = () => {
        const data = this.opts.tableData.data;
        if (data && data.length > 0) {
          const allQ = data.map(d => {
            const out: any = {};
            d.forEach(c => {
              out[c.property] = c.value;
            })
            return out;
          });
          this.bindView(allQ);
        }
      }
      transform();
    } else {
      this.status = 2;
    }
    this.subTitlePrefixs = ['一', '二', '三', '四'];
  }

  bindView(allQ) {
    const alter = (name) => {
      if (this[name + 'List'].length > 0) {
        this.prefixMain[name] = this.subTitlePrefixs.shift();
        this.markSets[name] = { total: 0, average: 0 };
        this[name + 'List'].forEach(c => {
          this.markSets[name]['total'] += c.SCORE || 0;
        })
        this.markSets[name]['average'] = Math.round(this.markSets[name]['total'] / this[name + 'List'].length);
      }
    }
    this.TFList = allQ.filter(a => a.TYPE === 'TF');
    alter('TF');
    this.radioList = allQ.filter(a => a.TYPE === 'RADIO').map(c => {
      if (c) {
        c.optionList = [];
        const pre = 'OPTION_';
        ['A', 'B', 'C', 'D', 'E'].forEach(b => {
          const val = c[pre + b];
          val && c.optionList.push([b, val]);
        });
      }
      return c;
    });
    alter('radio');
    this.checkboxList = allQ.filter(a => a.TYPE === 'CHECKBOX');
    alter('checkbox');
  }

  checkLeftTime() {
    const past = new Date().getTime() - this.beginTime.getTime();
    const left = this.examTime * 60 * 1000 - past;
    if (left >= 0) {
      const minute = ~~(left / (1000 * 60));
      const minuteString = minute < 10 ? '0' + minute : minute;
      const second = ~~((left - minute * 1000 * 60) / 1000);
      const secondString = second < 10 ? '0' + second : second;
      this.leftTime = `${minuteString}:${secondString}`;
    }
    setTimeout(() => this.checkLeftTime(), 1000)
  }
}
