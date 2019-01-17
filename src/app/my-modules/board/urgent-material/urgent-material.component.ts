import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-urgent-material',
  templateUrl: './urgent-material.component.html',
  styleUrls: ['./urgent-material.component.css'],
})
export class UrgentMaterialComponent implements OnInit {
  constructor() {}

  ngOnInit() { }

   /* data 是该条数据， prop是栏位属性名。改数据样式*/
   bodySetStyle = (data, prop) => {
     //   console.log('20' + data.INPUT_DATE);
   /*  if (data.ETA_TIME && moment('20' + data.INPUT_DATE).isBefore( moment().add(1, 'days')) ) {
      return {
        color: 'red',
      };
    } */
    if ( data.IQC_FINISHED_TIME ) {
      return {
        color: 'green',
      };
    }
  };

}
