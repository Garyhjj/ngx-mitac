import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models';
import * as moment from 'moment';

@Component({
  selector: 'app-reservation-type',
  templateUrl: './reservation-type.component.html',
  styleUrls: ['./reservation-type.component.css']
})
export class ReservationTypeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getDataDrive(d: DataDrive) {
    d.onUpdateData((data) => {
      data.LOOKUP_TYPE = 'IT_SERVICE_TYPE';
      data.DESCRIPTION = 'N/A';
      data.ENABLED_FLAG = 'Y';
      data.START_DATE = data.START_DATE || moment().format('YYYY-MM-DD');
    });
  }

}
