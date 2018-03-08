import { CascaderLazySet } from './../../data-drive/shared/models/input/index';
import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CascaderOption } from '../../data-drive/shared/models/index';
import { HttpClient } from '@angular/common/http';
import { APPConfig } from '../../../config/app.config';
import { replaceQuery, isArray } from '../../../utils/index';
import { AuthService } from '../../../../core/services/auth.service';


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

  @Input() myPlaceHolder: string = '請選擇';
  @Input() myOptions: CascaderOption[];
  @Input() myCascaderLazySets: CascaderLazySet[];
  @Input() myProperties: string[];
  @Input() loadAPI: string;
  _value: any[] = null;
  user = this.auth.user;
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {

  }

  /**
   * 给外部formControl写入数据
   * 
   * @param {*} value 
   */
  writeValue(value: any) {
    if (value === null) {
      this._value = [''];
    }else if(isArray(value)){
      this._value = value;
      setTimeout(() =>this._console(this._value),50);
    }else if(typeof value === 'string'){
      this._value = value.split(',');
      setTimeout(() =>this._console(this._value),50);
    }else {
      this._value = [''];
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
    let out: any= {}; 
    value.forEach((v,idx) => {
      const myPropertys = this.myProperties;
      if(myPropertys && myPropertys.length>0 && myPropertys[idx]) {
        out[myPropertys[idx]] = v;
      }
    })
    if(Object.keys(out).length === 0) {
      out = null;
    }
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
    const lazySet  = myCascaderLazySets.find(s => s.lazyLayer === (idx+2));
    if(lazySet) {
      if(this.myProperties && this.myProperties.length < idx+2) {
        throw new Error('myProperties 数组长度不足，无法进行懒加载项目');
      }
      this.getLazyData(lazySet, {[this.myProperties[idx+1]]: option.value}, (val) => {
        e.resolve(val)
      }, () => option.loading = false, (res) => {
        const params = lazySet.params;
        if(params.length > 2) {
          return res.filter(r => r[params[2]] === option.value);
        }else {
          return res;
        }
      })
    }else {
      option.loading = false;
      e.resolve([{value: '', label: '空', isLeaf: true}])
    }
  }

  ngOnInit() {
    if(!isArray(this.myOptions) || this.myOptions.length === 0) {
      if(!isArray(this.myCascaderLazySets) || this.myCascaderLazySets.length === 0) {
        throw new Error('级联组件参数不够')
      }else {
        const first = this.myCascaderLazySets[0];
        this.getLazyData(first,{} , (val) => this.myOptions= val);
      }
    }
  }

  getLazyData(set: CascaderLazySet, query:any, succ: (val) => void, final?: () => void, filter?: (res) => any[]) {
    this.http.get(replaceQuery(APPConfig.baseUrl + set.API, query, this.user)).subscribe((c: any[]) => {
      if(isArray(c)) {
        if(filter) {
          c = filter(c);
        }
        const out  = c.map(r => {
          let toParams: string[];
          if(!isArray(set.params)) {
            toParams = Object.keys(r);
          }else {
            toParams = set.params;
          }
          const lg = toParams.length;
          if(lg === 0) {
            return {
              value: '',
              label: '空',
              isLeaf: true
             }
          }else if(lg === 1) {
            return {
              value: r[toParams[0]],
              label: r[toParams[0]],
              isLeaf: set.isLeaf
             }
          }else if(lg > 1) {
            return {
              value: r[toParams[0]],
              label: r[toParams[1]],
              isLeaf: set.isLeaf
             }
          }
        });
        out.unshift({
          value: '',
          label: '空',
          isLeaf: true
         })
        succ(out);
      }
      final && final();
    },err => final && final())
  }

}
