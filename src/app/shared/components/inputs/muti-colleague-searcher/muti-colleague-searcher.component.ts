import {
  FormGroup,
  FormArray,
  FormBuilder,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { isArray } from '../../../utils';

@Component({
  selector: 'app-muti-colleague-searcher',
  templateUrl: './muti-colleague-searcher.component.html',
  styleUrls: ['./muti-colleague-searcher.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MutiColleagueSearcherComponent),
      multi: true,
    },
  ],
})
export class MutiColleagueSearcherComponent implements OnInit {
  mutiForm: FormGroup;
  @Input() searcherOption;
  private propagateChange = (_: any) => {};

  constructor(private fb: FormBuilder) {}

  /**
   * 给外部formControl写入数据
   *
   * @param {*} value
   */
  writeValue(value: any) {
    value = isArray(value) ? value : [value];
    this.initForm(value);
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
  registerOnTouched(fn: any) {}

  ngOnInit() {}

  initForm(nameArr: string[] = []) {
    if (nameArr.length === 0) {
      nameArr.push(null);
    }
    const form = this.fb.group({
      arr: new FormArray(nameArr.map(n => this.initOneForm(n))),
    });
    form.valueChanges.subscribe(val =>
      this.propagateChange(val.arr.map(_ => _.col)),
    );
    this.mutiForm = form;
  }

  cancleEmp(idx: number) {
    const fa = this.mutiForm.get('arr') as FormArray;
    fa.removeAt(idx);
  }

  initOneForm(name = null) {
    return this.fb.group({
      col: [name],
    });
  }

  addEmp() {
    const fa = this.mutiForm.get('arr') as FormArray;
    fa.push(this.initOneForm());
  }
}
