import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-radio-question',
  templateUrl: './radio-question.component.html',
  styleUrls: ['./radio-question.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioQuestionComponent),
      multi: true
    }
  ]
})
export class RadioQuestionComponent implements OnInit {
  @Input() radios = [[1,'5分鐘'],[2,'10分鐘'],[3,'15分鐘'],[4,'20分鐘']];
  title = '工作時間員工中途出廠再進廠不超過（）不會產生門禁異常';

  @Input() question;
  @Input() fontSize: string = '1.6rem';
  @Input() titlePrefix: string = '';
  @Input() result:{
    trueAnswer: any,
    yourAnswer: any
  }
  radioValue;
  yourAnswerString;
  private propagateChange = (_: any) => { };

  constructor() { }

  /**
   * 给外部formControl写入数据
   * 
   * @param {*} value 
   */
  writeValue(value: string) {
    if(value) {
      this.radioValue = value;
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

  change(val) {
    this.propagateChange(val);
  }
  ngOnInit() {
    this.checkResult();
  }

  checkResult() {
    const result = this.result;
    if(result) {
      if(result.hasOwnProperty('trueAnswer')) {
        this.radioValue = result.trueAnswer;
      }
      if(result.hasOwnProperty('yourAnswer')) {
        this.yourAnswerString = this.radios.filter(r => r[0] === result.yourAnswer)[0][1];
      }
    }
  }

}
