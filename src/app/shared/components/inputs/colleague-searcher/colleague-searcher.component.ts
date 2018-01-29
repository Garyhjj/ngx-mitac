import { UtilService } from './../../../../core/services/util.service';
import { Subject } from 'rxjs/Rx';
import { AppService } from './../../../../core/services/app.service';
import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-colleague-searcher',
  templateUrl: './colleague-searcher.component.html',
  styleUrls: ['./colleague-searcher.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColleagueSearcherComponent),
      multi: true
    }
  ]
})
export class ColleagueSearcherComponent implements OnInit, OnDestroy {
  private propagateChange = (_: any) => { };
  selectedOption;
  searchOptions = [];

  searchTerms = new Subject<string>();
  mySub: Subscription

  constructor(
    private appService: AppService,
    private util: UtilService
  ) { }

  /**
   * 给外部formControl写入数据
   * 
   * @param {*} value 
   */
  writeValue(value: string) {
    value = value + '';
    if(value){
      this.appService.getColleague(value).subscribe((data: any) => {
        if(data.length === 1) {
          this.searchOptions = data;
          this.selectedOption = data[0];
          this.propagateChange(data[0].split(',')[0]);
        }else {
          this.propagateChange('')
        }
      }, (err) => {this.util.errDeal(err); this.propagateChange('')});
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

  ngOnInit() {
    this.mySub = this.searchTerms.asObservable().debounceTime(300).distinctUntilChanged().subscribe((term: string) => {
      const query = encodeURI(term);
      this.appService.getColleague(term).subscribe((data: any) => {
        this.searchOptions = data;
      }, (err) => {this.util.errDeal(err)});
    })
  }

  ngOnDestroy() {
    this.mySub && this.mySub.unsubscribe();
  }

  searchChange(searchText) {
    this.searchTerms.next(searchText);
  }

  change(val: string) {
    if (val) {
      const empo = val.split(',')[0];
      this.propagateChange(empo);
    } else {
      this.propagateChange('');
    }
  }

}
