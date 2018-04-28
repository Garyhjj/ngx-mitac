import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { DataDriveComponent } from '../../../shared/components/data-drive/data-drive.component';
import { TableDataColumn } from '../../../shared/components/data-drive/shared/models';

@Component({
  selector: 'app-osp',
  templateUrl: './osp.component.html',
  styleUrls: ['./osp.component.css'],
})
export class OspComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    /*   setTimeout(() => {
        // console.log(document.getElementsByTagName('span'));
        let span = document.getElementsByTagName('span');
        for (let i = 0; i < span.length; i++) {
          if (span[i].innerText === '>24H Qty') {
            span[i].style.color = 'gray';
            console.log('233');
          }
          if (span[i].innerText === '22~24H Qty') {
            span[i].style.color = 'red';
          }
          if (span[i].innerText === '20~22H Qty') {
            span[i].style.color = 'yellow';
          }
          if (span[i].innerText === '<20H Qty') {
            span[i].style.color = 'green';
          }
        }
      }, 1000); */
  }

  /* 改表头样式*/
  headerSetStyle = (c: TableDataColumn) => {
    if (c.property === 'GREATER_THAN_24H') {
      return {
        color: '#BEBEBE',
      };
    } else if (c.property === 'BETWEEEN_22H_TO_24H') {
      return {
        color: 'red',
      };
    } else if (c.property === 'BETWEEEN_20H_TO_22H') {
      return {
        color: '#EAC100',
      };
    } else if (c.property === 'LESS_THAN_20H') {
      return {
        color: 'green',
      };
    }
  };

  /* data 是该条数据， prop是栏位属性名。改数据样式*/
  bodySetStyle = (data, prop) => {
    if (prop === 'GREATER_THAN_24H') {
      return {
        color: '#BEBEBE',
        'font-weight': 'bold',
      };
    } else if (prop === 'BETWEEEN_22H_TO_24H') {
      return {
        color: 'red',
        'font-weight': 'bold',
      };
    } else if (prop === 'BETWEEEN_20H_TO_22H') {
      return {
        color: '#EAC100',
        'font-weight': 'bold',
      };
    } else if (prop === 'LESS_THAN_20H') {
      return {
        color: 'green',
        'font-weight': 'bold',
      };
    }
  };
}
