import { CascaderLazySet } from './../../data-drive/shared/models/input/index';
import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CascaderOption } from '../../data-drive/shared/models/index';
import { HttpClient } from '@angular/common/http';
import { APPConfig } from '../../../config/app.config';
import { replaceQuery } from '../../../utils/index';


@Component({
  selector: 'app-my-cascader',
  templateUrl: './my-cascader.component.html',
  styleUrls: ['./my-cascader.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MyCascaderComponent),
      multi: true
    }
  ]
})
export class MyCascaderComponent implements OnInit {

  private propagateChange = (_: any) => { };

  myValue:any;

  @Input() myPlaceHolder: string = '請選擇';
  @Input() myOptions: CascaderOption[];
  @Input() myCascaderLazySets: CascaderLazySet[];
  @Input() myProperties: string[];
  @Input() loadAPI: string;
  _value: any[] = null;

  constructor(
    private http: HttpClient,
  ) {

  }

  /**
   * 给外部formControl写入数据
   * 
   * @param {*} value 
   */
  writeValue(value: string) {
    if (value) {
      this.myValue = value;
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

  _console(value) {
    const out: any= {}; 
    value.forEach((v,idx) => {
      const myPropertys = this.myProperties;
      if(myPropertys && myPropertys.length>0 && myPropertys[idx]) {
        out[myPropertys[idx]] = v;
      }
    })
    this.propagateChange(out);
  }

  /** load data async */
  loadData(e: {option: any, index: number, resolve: Function, reject: Function}): void {
    const idx = e.index;
    if (idx === -1) {
      e.resolve(this.myOptions);
      return;
    }

    const option = e.option;
    option.loading = true;
    const myCascaderLazySets = this.myCascaderLazySets || [];
    const lazySet  = myCascaderLazySets.find(s => s.lazyLayer === (idx+1));
    if(lazySet) {
      // if(this.myProperties && this.myProperties.length < idx+2) {
      //   throw new Error('myProperties 数组长度不足，无法进行懒加载项目');
      // }
      // if(!this.loadAPI) {
      //   throw new Error('loadAPI 为空，无法请求数据');
      // }
      // this.http.get(APPConfig.baseUrl + replaceQuery(this.loadAPI, {[this.myProperties[idx]]:option.value})).subscribe(res => {
      //   if(res instanceof Array) {
      //     const targets = res.map(r => r[this.myProperties[idx+1]]).filter(f => f);
      //     const noRepeat = Array.from(new Set(targets));
      //     option.loading = false;
      //     if(noRepeat.length === 0 ) {
      //       noRepeat.push('')
      //     }
      //     e.resolve(noRepeat.map(n => ({value:n, label:n, isLeaf:lazySet.isLeaf})))
      //   }
      // })
      setTimeout(() => {
        option.loading = false;
        e.resolve([{value: idx+1, label: idx+1, isLeaf:lazySet.isLeaf}]);
      }, 1000);
    }else {
      e.resolve([{value: '', label: '', isLeaf: true}])
    }
  }

  ngOnInit() {
  }

}
