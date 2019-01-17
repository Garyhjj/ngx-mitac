import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sgMessageTime' })
export class MessageTimePipe implements PipeTransform {
  transform(value: number): string {
    let mesTime = new Date(value);
    let year = mesTime.getFullYear();
    let month = mesTime.getMonth();
    let day = mesTime.getDate();
    let hour = mesTime.getHours();
    let minute = mesTime.getMinutes();
    let nowTime = new Date();
    let nowyear = nowTime.getFullYear();
    let nowday = nowTime.getDate();
    let nowMonth = nowTime.getMonth();
    let show = '';
    const during = nowTime.getTime() - mesTime.getTime();
    if (nowyear - year > 0) {
      show = 'year';
    } else if (nowyear === year) {
      if (month === nowMonth && nowday - day === 1) {
        show = '昨天';
      } else if (month === nowMonth && nowday - day === 2) {
        show = '前天';
      } else if (month === nowMonth && nowday === day) {
        show = 'time';
      } else {
        show = 'month';
      }
    }
    let prefix = '';
    if (show === 'year') {
      prefix = year + '年' + month + '月' + day + '日';
    } else if (show === 'month') {
      prefix = month + 1 + '月' + day + '日';
    } else if (show === '昨天') {
      prefix = '昨天';
    } else if (show === '前天') {
      prefix = '前天';
    }
    let minuteFormat: any = minute < 10 ? '0' + minute : minute;
    let hourFormat = '';
    if (during < 1000 * 60) {
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
    return prefix + hourFormat + ':' + minuteFormat;
  }
}
