import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-my-date-picker',
  templateUrl: './my-date-picker.component.html',
  styleUrls: ['./my-date-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MyDatePickerComponent),
      multi: true
    }
  ]
})
export class MyDatePickerComponent implements OnInit {

  @Input() myPickerFormat = 'YYYY-MM-DD';
  @Input() myShowTime: string | boolean = false;
  @Input() myFormat: string = 'YYYY-MM-DD';
  @Input() myPlaceHolder: string = '請選擇時間';
  @Input() myMode: string = 'day';
  private propagateChange = (_: string) => { };
  _date: Date = null;
  dataString: string;
  constructor() { }

  ngOnInit() {
  }

  /**
   * 给外部formControl写入数据
   * 
   * @param {*} value 
   */
  writeValue(value: string) {
    if (value) {
      this.dataString = value;
      this._date = new Date(value);
    }
  }

  /**
   * 把外面登记的监测change的函数赋值给this.propagateChange
   * 当内部数据改变时,可使用this.propagateChange(this.imgs)去触发传递出去
   * @param {*} fn 
   */
  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  /**
   * 也是一样注册,当 touched 然后调用
   * @param {*} fn 
   */
  registerOnTouched(fn: any) { }

  /**
   * 内部更改例子
   * @param {*} fn 
   */
  change(value: Date) {
    this.dataString = value ? moment(value).format(this.myPickerFormat) : '';
    this.propagateChange(this.dataString)//去触发外部监控的函数
  }

}
