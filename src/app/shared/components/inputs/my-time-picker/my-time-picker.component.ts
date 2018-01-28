import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-my-time-picker',
  templateUrl: './my-time-picker.component.html',
  styleUrls: ['./my-time-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MyTimePickerComponent),
      multi: true
    }
  ]
})
export class MyTimePickerComponent implements OnInit {

  private propagateChange = (_: string) => { };

  @Input() myPickerFormat = 'HH:mm:ss';
  @Input() myFormat: string = 'HH:mm:ss';
  @Input() myPlaceHolder: string = '請選擇時間';
  imgs: string[];
  _date = new Date();
  timeString: string = '';
  constructor(

  ) { }

  ngOnInit() {
  }

  /**
   * 给外部formControl写入数据
   * 
   * @param {*} value 
   */
  writeValue(value: string) {
    if (value) {
      const date = new Date('2018-01-01T'+value);
      if(date.toString() !== 'Invalid Date') {
        this._date = date;
        this.timeString = value;
      }
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
  registerOnTouched(fn:any) { }

  change(val:Date) {
    console.log(val)
    this.timeString = val ? moment(val).format(this.myPickerFormat) : '';
    this.propagateChange(this.timeString)//去触发外部监控的函数
  }
  
}
