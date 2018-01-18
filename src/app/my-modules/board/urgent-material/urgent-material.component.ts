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
  dataDrive;
  constructor() { }

  ngOnInit() {
    this.dataDrive = this.prepare();
    this.data2 = this.dataDrive.tableData;
    
    this.data2.data = [];
    for (let i = 0; i < 100; i++) {
      this.data2.data.push([{
        property: '1', value: '345'
      },
      {
        property: '2', value: '456456'
      }, {
        property: '3', value: '67879'
      }, {
        property: '4', value: '2342354'
      }]);
      this.data.push({
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
      });
    };
   

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
