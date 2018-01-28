import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox-question',
  templateUrl: './checkbox-question.component.html',
  styleUrls: ['./checkbox-question.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxQuestionComponent),
      multi: true
    }
  ]
})
export class CheckboxQuestionComponent implements OnInit, AfterViewInit {

  checkOptionsOne = [
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear', checked: false },
    { label: 'Orange', value: 'Orange', checked: false },
  ];
  title = '工作時間員工中途出廠再進廠不超過（）不會產生門禁異常';
  @Input() fontSize: string = '1.6rem';
  @Input() titlePrefix = '';
  @ViewChild('checkbox')
  checkbox: any;
  private propagateChange = (_: any) => { };

  constructor() { }

  /**
   * 给外部formControl写入数据
   * 
   * @param {*} value 
   */
  writeValue(value: any[]) {
    if(Object.prototype.toString.call(value) === '[object Array]') {
      this.checkOptionsOne = value;
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

  updateSingleChecked() {
    this.propagateChange(this.checkOptionsOne.map(c => c.value).join(','));
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    setTimeout(() => {
      const labels = this.checkbox._el.querySelectorAll('label');
      Array.prototype.forEach.call(labels, (l) => {
        l.style.fontSize = this.fontSize;
      })
    }, 50)
  }

}
