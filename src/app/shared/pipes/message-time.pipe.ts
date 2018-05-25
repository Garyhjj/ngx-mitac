import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sgMessageTime' })
export class MessageTimePipe implements PipeTransform {
  transform(value: number): string {
    let mesTime = new Date(value);
    let year = mesTime.getFullYear();
    let month = mesTime.getMonth();
    let day = mesTime.getDay();
    let hour = mesTime.getHours();
    let minute = mesTime.getMinutes();
    let nowTime = new Date();
    let nowyear = nowTime.getFullYear();
    let nowday = nowTime.getDay();
    let show = '';
    if (nowyear - year > 0) {
      show = 'year';
    } else if (nowday - day > 0) {
      if (nowday - day === 1) {
        show = '昨天';
      } else if (nowday - day === 2) {
        show = '前天';
      } else {
        show = 'month';
      }
    } else {
      show = 'time';
    }
    if (show === 'year') {
      return year + '年' + month + '月' + day + '日';
    } else if (show === 'month') {
      return month + 1 + '月' + day + '日';
    } else if (show === '昨天') {
      return '昨天';
    } else if (show === '前天') {
      return '前天';
    } else {
      let minuteFormat: any = minute < 10 ? '0' + minute : minute;
      let hourFormat = '';
      if (nowTime.getTime() - mesTime.getTime() < 100 * 60) {
        return 'less than a minute';
      } else if (hour >= 0 && hour < 6) {
        hourFormat = '凌晨 ' + hour;
      } else if (hour >= 6 && hour < 12) {
        hourFormat = '早上 ' + hour;
      } else if (hour >= 12 && hour < 13) {
        hourFormat = '中午 ' + hour;
      } else if (hour >= 13 && hour < 18) {
        hourFormat = '下午 ' + hour;
      } else if (hour >= 18 && hour < 24) {
        hourFormat = '晚上 ' + hour;
      }
      return hourFormat + ':' + minuteFormat;
    }
  }
}
