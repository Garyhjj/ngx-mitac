import { DataDrive } from './../shared/models/index';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  isShowModal = false;
  dataDrive: DataDrive;
  attachFn: any;
  headerFontSize = 16;
  bodyFontSize = 16;
  viewerType: string;
  @Input()
  set opts(opts: DataDrive) {
    this.dataDrive = opts;
    this.viewerType = opts.dataViewSet.type;
  }
  constructor(
    private _message: NzMessageService,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.attachFn && window.removeEventListener('keydown', this.attachFn);
  }

  changeHeaderSize() {
    switch (this.viewerType) {
      case 'table':
        this.dataDrive.dataViewSet.changeHeaderFontSize(this.headerFontSize + 'px');
        break;
    }
  }

  changeBodySize() {
    switch (this.viewerType) {
      case 'table':
        this.dataDrive.dataViewSet.changeBodyFontSize(this.bodyFontSize + 'px');
        break;
    }
  }

  showModal() {
    this.dataDrive.modalSataus = this.isShowModal = true;
    this._message.info('按下键盘Esc按钮可退出', { nzDuration: 5000 });
    if (!this.attachFn) {
      window.addEventListener('keydown',
        this.attachFn = (e) => e.keyCode === 27 && (this.dataDrive.modalSataus = this.isShowModal = false));
    }
  }

}
