import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-mx-checkbox',
  templateUrl: './mx-checkbox.component.html',
  styleUrls: ['./mx-checkbox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MxCheckboxComponent),
      multi: true
    }
  ]
})
export class MxCheckboxComponent implements OnInit {
  private propagateChange = (_: any) => { };
  _value = [];
  @Input() options = [];
  @Input() myPlaceHolder;
  _pickerFormat = 'string'
  @Input()
  set pickerFormat(v: string) {
    if (['string', 'array'].indexOf(v) > -1) {
      this._pickerFormat = v;
    }
  }

  constructor() { }

  /**
   * 给外部formControl写入数据
   * 
   * @param {*} value 
   */
  writeValue(value: any) {
    if (value !== void (0)) {
      if ((typeof value === 'string') && value) {
        if(this._pickerFormat === 'string') {
          this._value = value.split(',');
        }else {
          this._value = [value];
        }
      } else if (typeof value === 'number') {
        this._value = [value];
      } else if (Object.prototype.toString.call(value) === '[object Array]') {
        this._value = value;
      }
    }
    if(this._value.length > 0) {
      setTimeout(() => this.change(), 50);
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

  change() {
    let out;
    if (this._pickerFormat === 'string') {
      out = this._value.join(',')
    } else {
      out = this._value;
    }
    this.propagateChange(out);
  }

  ngOnInit() {
 
  }

}
