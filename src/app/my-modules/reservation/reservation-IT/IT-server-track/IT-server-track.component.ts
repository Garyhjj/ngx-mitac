import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd';
import { ImpressionListComponent } from './../shared/components/impression-list/impression-list.component';
import { ReservationApplication } from './../shared/models/index';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models';
import { ReservationITService } from '../shared/services/reservaton-IT.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-IT-server-track',
  templateUrl: './IT-server-track.component.html',
  styleUrls: ['./IT-server-track.component.css'],
})
export class ITServerTrackComponent implements OnInit {
  impressionName = 'impression';
  translateText: string;
  bodyCellStyleFn = (data, prop) => {
    if (prop === 'SERVICE_DESC') {
      return {
        'max-width': '350px'
      };
    }
  }
  constructor(
    private modalService: NzModalService,
    private translateService: TranslateService,
    private itSre: ReservationITService
  ) {}

  ngOnInit() {
    this.translateService.get('serviceModule.yinxiang2').subscribe(data => {
      this.translateText = data;
    });
  }

  getDataDrive(d: DataDrive) {
    d.dataViewSet.more.showAction = false;
    d.beforeInitTableData(data => {
      return data.map(da => {
        da[this.impressionName] = '';
        return da;
      }).sort((a, b) => this.itSre.sortByTime(a, b, true));
    });
  }

  showImpressionDetail(app: ReservationApplication) {
    const subscription = this.modalService.create({
      nzTitle: this.translateText,
      nzContent: ImpressionListComponent,
      nzOnOk() {},
      nzOnCancel() {},
      nzFooter: '',
      nzComponentParams: {
        application: app,
      },
    });
  }
}
