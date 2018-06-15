import { UtilService } from './../../../../core/services/util.service';
import { AppService } from './../../../../core/services/app.service';
import { Component, OnInit, forwardRef, OnDestroy, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  map,
} from 'rxjs/operators';

@Component({
  selector: 'app-colleague-searcher',
  templateUrl: './colleague-searcher.component.html',
  styleUrls: ['./colleague-searcher.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColleagueSearcherComponent),
      multi: true,
    },
  ],
})
export class ColleagueSearcherComponent implements OnInit, OnDestroy {
  selectedOption;
  searchOptions = [];
  searchTerms = new Subject<string>();
  mySub: Subscription;

  @Input() miDisabled;

  @Input() miPlaceHolder = '請輸入英文名/工號/中文名';
  @Input() miSearchFilter;
  isLoading = false;

  private propagateChange = (_: any) => {};

  constructor(private appService: AppService, private util: UtilService) {}

  /**
   * 给外部formControl写入数据
   *
   * @param {*} value
   */
  writeValue(value: string) {
    if (value) {
      value = value + '';
      this.appService
        .getColleague(value)
        .pipe(map(_ => (this.miSearchFilter ? this.miSearchFilter(_) : _)))
        .subscribe(
          (data: any) => {
            if (data.length > 0) {
              const val = data.find(
                d =>
                  d.EMPNO === value ||
                  d.NICK_NAME === value ||
                  d.USER_NAME === value,
              );
              if (val) {
                const alter = [val].map(
                  c => c.EMPNO + ',' + c.NICK_NAME + ',' + c.USER_NAME,
                );
                this.searchOptions = alter;
                this.selectedOption = alter[0];
                this.propagateChange(val.EMPNO);
              } else {
                this.propagateChange('');
              }
            } else {
              this.propagateChange('');
            }
          },
          err => {
            this.util.errDeal(err);
            this.propagateChange('');
          },
        );
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
  registerOnTouched(fn: any) {}

  ngOnInit() {
    this.mySub = this.searchTerms
      .asObservable()
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(_ => (this.isLoading = true)),
        switchMap((term: string) => {
          const query = encodeURI(term);
          return this.appService.getColleague(term);
        }),
        map(_ => (this.miSearchFilter ? this.miSearchFilter(_) : _)),
      )
      .subscribe(
        (data: any) => {
          this.isLoading = false;
          this.searchOptions = data.map(
            c => c.EMPNO + ',' + c.NICK_NAME + ',' + c.USER_NAME,
          );
        },
        err => {
          this.util.errDeal(err);
          this.isLoading = false;
        },
      );
  }

  ngOnDestroy() {
    // tslint:disable-next-line:no-unused-expression
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
