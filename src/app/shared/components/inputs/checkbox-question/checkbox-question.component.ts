import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isArray } from '../../../utils/index';

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

  @Input() checkOptions: { label: string, value: string, checked: boolean }[] = [
  ];
  @Input() title = '';
  @Input() fontSize: string = '1.6rem';
  @Input() titlePrefix = '';
  @ViewChild('checkbox')
  checkbox: any;
  private propagateChange = (_: any) => { };
  _result;

  @Input()
  set result(r: {
    trueAnswer: any,
    yourAnswer: any
  }) {
    if (typeof r === 'object') {
      this._result = r;
      this.checkResult();
    }
  };
  get result() {
    return this._result;
  }

  yourAnswerString = '';

  constructor() { }

  /**
   * 给外部formControl写入数据
   * 
   * @param {*} value 
   */
  writeValue(value: any) {
    if (Object.prototype.toString.call(value) === '[object Array]') {
      this.checkOptions = value;
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
    this.propagateChange(this.checkOptions.filter(c => c.checked).map(a => a.value).join(','));
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    setTimeout(() => {
      const labels = this.checkbox._el.querySelectorAll('label');
      Array.prototype.forEach.call(labels, (l) => {
        l.style.fontSize = this.fontSize;
      });
    }, 50);
  }

  checkResult() {
    const result = this.result;
    if (result) {
      if (result.hasOwnProperty('trueAnswer')) {
        const trueAnswer: string[] = result.trueAnswer ? result.trueAnswer.split(',') : [];
        let yourAnswer = [];
        if (result.hasOwnProperty('yourAnswer')) {
          yourAnswer = result.yourAnswer ? result.yourAnswer.split(',') : [];
          this.yourAnswerString = '';
        }
        this.checkOptions = this.checkOptions.map(c => {
          if (trueAnswer.indexOf(c.value) > -1) {
            c.checked = true;
          } else {
            c.checked = false;
          }
          if (yourAnswer.indexOf(c.value) > -1) {
            this.yourAnswerString += this.yourAnswerString ? '; ' + c.label : c.label;
          }
          return c;
        });
      }
    }
  }

}
