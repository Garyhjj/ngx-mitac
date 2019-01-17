import { UtilService } from './../../../../core/services/util.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models';

@Component({
  selector: 'app-reservation-type',
  templateUrl: './reservation-type.component.html',
  styleUrls: ['./reservation-type.component.css'],
})
export class ReservationTypeComponent implements OnInit {
  constructor(private util: UtilService) {}

  ngOnInit() {}

  getDataDrive(d: DataDrive) {
    d.onUpdateData(data => {
      data.LOOKUP_TYPE = 'IT_SERVICE_TYPE';
      data.DESCRIPTION = 'N/A';
      data.ENABLED_FLAG = 'Y';
      data.START_DATE =
        data.START_DATE || this.util.dateFormat(new Date(), 'YYYY-MM-DD');
    });
  }
}
