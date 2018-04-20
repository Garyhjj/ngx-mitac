import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd';
import { ImpressionListComponent } from './../shared/components/impression-list/impression-list.component';
import { ReservationApplication } from './../shared/models/index';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-IT-server-track',
  templateUrl: './IT-server-track.component.html',
  styleUrls: ['./IT-server-track.component.css']
})
export class ITServerTrackComponent implements OnInit {

  impressionName = 'impression';
  translateText: string;
  constructor(
    private modalService: NzModalService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.translateService.get('serviceModule.yinxiang2').subscribe(data => {
      this.translateText = data;
    });
  }

  getDataDrive(d: DataDrive) {
    d.beforeInitTableData((data) => {
      return data.map(da => {
        da[this.impressionName] = '';
        return da;
      });
    });
  }

  showImpressionDetail(app: ReservationApplication) {
    const subscription = this.modalService.open({
      title: this.translateText,
      content: ImpressionListComponent,
      onOk() {
      },
      onCancel() {

      },
      footer: false,
      componentParams: {
        application: app
      }
    });
    subscription.subscribe(result => {
      // console.log(result);
    });
  }

}
