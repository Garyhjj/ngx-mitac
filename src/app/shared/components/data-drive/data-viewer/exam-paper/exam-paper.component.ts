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
  beginTime: Date;
  examTime: number = 25;
  leftTime: string;

  TFList = [];
  radioList = [];
  checkboxList = [];

  subTitlePrefixs = ['一', '二', '三', '四'];
  constructor() { }

  ngOnInit() {
    this.beginTime = new Date();
    this.checkLeftTime();
    if (this.opts) {
      const data = this.opts.tableData.data;
      if (data && data.length > 0) {
        const allQ = data.map(d => {
          const out: any = {};
          d.forEach(c => {
            out[c.property] = c.value;
          })
          return out;
        });
        this.TFList = allQ.filter(a => a.TYPE === 'TF');
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
        this.checkboxList = allQ.filter(a => a.TYPE === 'CHECKBOX');
      }
    }
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
