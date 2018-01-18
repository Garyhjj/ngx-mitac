import { TabelViewSet, TableData, TabelViewSetMore } from './../../../models/index';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { DataDrive } from '../../../models/index';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit {
  _dataDrive: DataDrive;

  tableSet: TabelViewSet
  setDetail: TabelViewSetMore;

  tableData: TableData;

  dataViewList:any=[];

  canScroll:boolean;

  @Input()
  set opts(opts: DataDrive) {
    console.log(opts);
    this.tableSet = opts.dataViewSet as TabelViewSet;
    this.setDetail = this.tableSet.more;
    this.tableData = opts.tableData;
    this._dataDrive = opts;
  }
  _loading = false;
  _header = true;

  _scrollInterval:number;
  _loopScroll:boolean;
  constructor() {

  }

  cacalScrollHeight() {
    if (this.setDetail && this.setDetail.fixedHeader && this.setDetail.fixedHeader.scrollHeight === 'auto') {
      const otherHeight = document.querySelector('app-table table').getBoundingClientRect().bottom + 50;
      let body: any = document.querySelector('app-table .ant-table-body');
      body.style.maxHeight = `calc(100vh - ${otherHeight}px)`;
    }
  }

  dataChange() {
    setTimeout(() => this.initAutoScroll(),50);
  }
  initAutoScroll() {
    let autoScroll;
    if(this.setDetail && this.setDetail.fixedHeader && (autoScroll =this.setDetail.fixedHeader.autoScroll)) {
      this.dataViewList = document.querySelectorAll('app-table tr');
      this._scrollInterval = autoScroll.interval;
      this._loopScroll = autoScroll.loop;
      this.canScroll = true;
      this.autoScroll();
    }else {
      this.dataViewList = null;
      this._scrollInterval = NaN;
      this._loopScroll= false;
    }
  }
  autoScroll(idx:number =0) {
    if(idx >= this.dataViewList.length && this._loopScroll) {idx = 0};
    if(idx<this.dataViewList.length) {
      if(this.canScroll) {
        this.dataViewList[idx].scrollIntoView();
      }else {
        --idx;
      }
      setTimeout(() => this.autoScroll(++idx),this._scrollInterval)
    }
    
  }
  mouseEnter() {
    this.canScroll = false;
  }
  mouseLeave() {
    this.canScroll = true;
  }
  ngOnInit() {
    
  }
  ngAfterViewInit() {
    this.cacalScrollHeight();
  }

}
