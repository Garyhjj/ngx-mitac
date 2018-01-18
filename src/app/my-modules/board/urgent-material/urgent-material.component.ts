import { DataDrive, TableDataModel } from './../../../shared/models/index';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-urgent-material',
  templateUrl: './urgent-material.component.html',
  styleUrls: ['./urgent-material.component.css']
})
export class UrgentMaterialComponent implements OnInit {
  data: any = [];
  data2: TableDataModel;
  dataDrive: DataDrive;
  constructor() { }

  ngOnInit() {
    this.dataDrive = this.prepare();
    this.dataDrive.selfHideLists = ['3'];
    this.dataDrive.selfHideLists.push('2');
    this.data2 = this.dataDrive.tableData;
    this.data2.data = [];
    for (let i = 0; i < 100; i++) {
      const v = (i % 2 === 0) ? '' : '55';
      this.data2.data.push([{
        property: '1', value: v
      },
      {
        property: '2', value: '456456'
      }, {
        property: '3', value: '67879'
      }, {
        property: '4', value: ''
      }]);
    }
  }

  prepare() {
    var a = new DataDrive({
      id: 1, APIs: { search: 'UrgentMaterial/GetUrgentMaterial?wo={wo}' }, tableData: new TableDataModel({
        columns: [
          {
            property: '1', value: 'dfgdfgdf', type: {}
          },
          {
            property: '2', value: 'fgh', type: {}
          },
          {
            property: '3', value: 'fgh', type: {}
          },
          {
            property: '4', value: 'ert', type: {}
          }
        ]
      }
      )
    })
    console.log(a);
    return a;
  }

}
