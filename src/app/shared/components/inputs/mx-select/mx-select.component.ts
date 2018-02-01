import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isArray } from '../../../utils';
import { DataDriveService } from '../../data-drive/core/services/data-drive.service';

@Component({
  selector: 'app-mx-select',
  templateUrl: './mx-select.component.html',
  styleUrls: ['./mx-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MxSelectComponent),
      multi: true
    }
  ]
})
export class MxSelectComponent implements OnInit {

  private propagateChange = (_: any) => { };
  _value = [];
  _options = [];
  @Input()
  set options(os) {
    if (isArray(os)) {
      this._options = os;
    }
  }
  @Input() myPlaceHolder;
  @Input() lazyAPI;

  constructor(
    private dataDriveService: DataDriveService
  ) { }

  /**
   * 给外部formControl写入数据
   * 
   * @param {*} value 
   */
  writeValue(value: any) {
    if (value !== void (0)) {
      this._value = value;
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
    this.propagateChange(this._value);
  }

  ngOnInit() {
    this.lazyLoad();
  }

  lazyLoad() {
    if (this.lazyAPI) {
      this.dataDriveService.lazyLoad(this.lazyAPI).subscribe((r: any[]) => {
        if (isArray(r)) {
          this._options = r.filter(f => f).map(d => {
            if (isArray(d)) {
              if (d.length === 1) {
                return { property: d[0], value: d[0] }
              } else if (d.length > 1) {
                return { property: d[0], value: d[1] }
              }
            }else if (typeof d === 'object') {
              const keys = Object.keys(d);
              if (keys.length === 1) {
                return { property: d[keys[0]], value: d[keys[0]] }
              } else if (keys.length > 1) {
                return { property: d[keys[0]], value: d[keys[1]] }
              }
            }
          })
        }
      })
    }
  }

}
