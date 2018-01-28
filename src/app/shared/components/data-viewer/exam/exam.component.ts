import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {

  beginTime: Date;
  examTime: number = 25;
  leftTime: string;

  subTitlePrefixs = ['一','二','三','四'];
  constructor() { }

  ngOnInit() {
    this.beginTime = new Date();
    this.checkLeftTime();
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
