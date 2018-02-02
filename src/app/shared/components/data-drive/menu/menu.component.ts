import { DataUpdateComponent } from './../data-inputer/data-update/data-update.component';
import { DataDrive, DataViewType } from './../shared/models/index';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { DataDriveService } from '../core/services/data-drive.service';
import { isArray } from '../../../utils/index';

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
  menuDetail: string;
  currentViewIdx = -1;
  @Input()
  set opts(opts: DataDrive) {
    this.dataDrive = opts;
    this.viewerType = opts.dataViewSet.type;
  }
  constructor(
    private _message: NzMessageService,
    private dataDriveService: DataDriveService,
    private modalService: NzModalService
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

  changeMenuDetail(type:string) {
    this.menuDetail = type;
  }

  addItem() {
    if(!this.dataDrive.isDataAddable()) return;
    const subscription = this.modalService.open({
      title          : '新增',
      content        : DataUpdateComponent,
      onOk() {
      },
      onCancel() {

      },
      footer         : false,
      componentParams: {
        opts: this.dataDrive
      }
    });
    subscription.subscribe(result => {
      // console.log(result);
    })
  }

  showModal() {
    this.dataDrive.modalSataus = this.isShowModal = true;
    this._message.info('按下键盘Esc按钮可退出', { nzDuration: 5000 });
    if (!this.attachFn) {
      window.addEventListener('keydown',
        this.attachFn = (e) => e.keyCode === 27 && (this.dataDrive.modalSataus = this.isShowModal = false));
    }
  }

  switchViewType(type:DataViewType[]) {
    if(!isArray(type)) return;
    if(this.currentViewIdx < 0) {
      this.currentViewIdx = type.findIndex(t => t == this.dataDrive.dataViewSet.type);
    }
    if(this.currentViewIdx < 0) {
      this.currentViewIdx = 0;
    }
    this.currentViewIdx++;
    if(this.currentViewIdx > type.length-1) {
      this.currentViewIdx = 0;
    }
    this.dataDrive.switchViewType(type[this.currentViewIdx])
  }

  toExcel() {
    this.dataDriveService.toExcel(this.dataDrive);
  }

}
