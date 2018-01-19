import { Subscription } from 'rxjs/Rx';
import { TabelViewSet, TableData, TabelViewSetMore } from './../../../models/index';
import { Component, OnInit, Input, AfterViewInit, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { DataDrive } from '../../../models/index';
import { throttle } from '../../../util/index';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
  _dataDrive: DataDrive;

  tableSet: TabelViewSet;
  setDetail: TabelViewSetMore;
  tableData: TableData;
  dataViewList: any = [];
  canScroll: boolean = true;
  private timeEvent1;
  private timeEvent2;
  private hideLists: string[];
  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;
  @Input()
  set opts(opts: DataDrive) {
    this.tableSet = opts.dataViewSet as TabelViewSet;
    this.setDetail = this.tableSet.more;
    this.tableData = Object.assign({}, opts.tableData);
    this.tableData.data = [];
    this._dataDrive = opts;
    this.subjectHideList();
    this.subjectIsGettingData();
  }

  @Input()
  isModal: boolean;
  _loading = false;
  _header = true;

  _scrollInterval: number;
  _loopScroll: boolean;
  constructor(private ref: ChangeDetectorRef) {

  }

  cacalScrollHeight() {
    if (this.setDetail && this.setDetail.fixedHeader && this.setDetail.fixedHeader.scrollHeight === 'auto') {
      if (this.isModal) {
        const body: any = document.querySelector('.my-modal .ant-table-body');
        body.style.maxHeight = `calc(99vh)`;
      } else {
        const otherHeight = document.querySelector('app-table table').getBoundingClientRect().bottom + 50 + 3;
        const body: any = document.querySelector('.main-view .ant-table-body');
        body.style.maxHeight = `calc(100vh - ${otherHeight}px)`;
      }
    }
  }
  subjectHideList() {
    if (this._dataDrive) {
      if (this.sub1) {
        this.sub1.unsubscribe();
      }
      this.sub1 = this._dataDrive.observeHideLists().subscribe(ls => {
        this.hideLists = ls;
        this.updateFilterColumns();
      });
    }
  }

  subjectIsGettingData() {
    this.sub2 && this.sub2.unsubscribe();
    this.sub2 = this._dataDrive.observeIsGettingData().subscribe(s => {
      if (!s && this._loading) {
        this.updateFilterColumns();
      }
      this._loading = s;
    });
  }

  updateFilterColumns() {
    const ls = this.hideLists;
    const filter = c => ls.indexOf(c.property) < 0;
    const filterColumns = this._dataDrive.tableData.columns.slice().filter(filter);
    const originData = this._dataDrive.tableData.data && this._dataDrive.tableData.data.slice();
    var filterData;
    if (originData && originData.length > 0) {
      filterData = originData.map((trs) => trs.filter(filter));
    }
    this.tableData.columns = filterColumns;
    if (filterData) {
      this.tableData.data = filterData;
    }
    this.ref.detectChanges();
  }
  dataChange() {
    setTimeout(() => this.initAutoScroll(), 50);
  }
  initAutoScroll() {
    let autoScroll;
    if (this.setDetail && this.setDetail.fixedHeader && (autoScroll = this.setDetail.fixedHeader.autoScroll)) {
      const selector = this.isModal? '.my-modal app-table tr': '.main-view app-table tr'
      this.dataViewList = document.querySelectorAll(selector);
      this._scrollInterval = autoScroll.interval;
      this._loopScroll = autoScroll.loop;
      this.canScroll = true;
      this.autoScroll();
    } else {
      this.clearTimeEvent();
      this.dataViewList = null;
      this._scrollInterval = NaN;
      this._loopScroll = false;
    }
  }
  autoScroll(idx: number = 0) {
    clearTimeout(this.timeEvent1);
    if (idx >= this.dataViewList.length && this._loopScroll) { idx = 0 };
    if (idx < this.dataViewList.length) {
      if (this.canScroll) {
        this.dataViewList[idx].scrollIntoView();
      } else {
        --idx;
      }
      this.timeEvent1 = setTimeout(() => this.autoScroll(++idx), this._scrollInterval)
    }

  }
  runRegExp(target: any[], rules: string[][]) {
    if (rules && rules.length > 0) {
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule.length < 2) {
          return false;
        } else {
          const t = target.find(s => s.property === rule[0]);
          if (!t) {
            return false;
          }
          if (!new RegExp(rule[1]).test(t.value?t.value:'')) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }
  clearTimeEvent() {
    clearTimeout(this.timeEvent1);
  }
  unsubscribeAll() {
    this.sub1 && this.sub1.unsubscribe();
    this.sub2 && this.sub2.unsubscribe();
    this.sub3 && this.sub3.unsubscribe();
  }
  mouseEnter() {

    this.canScroll = false;
  }
  mouseLeave() {
    this.canScroll = true;
  }
  ngOnInit() {
    if(!this.isModal) {
      this.sub3 = this._dataDrive.observeIsShowModal().subscribe(s => this.canScroll = s);
    }
  }

  ngOnDestroy() {
    this.clearTimeEvent();
    this.unsubscribeAll();
  }
  ngAfterViewInit() {
    this.cacalScrollHeight();
  }

  ngAfterViewChecked() {
    throttle(this.cacalScrollHeight,this);
  }

}
