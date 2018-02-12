import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models/index';
import { FormBuilder } from '@angular/forms';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-inspection-boss-schedule',
  templateUrl: './inspection-boss-schedule.component.html',
  styleUrls: ['./inspection-boss-schedule.component.css']
})
export class InspectionBossScheduleComponent implements OnInit {

  isVisible = false;
  formLayout = 'horizontal'
  scheduleForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    
  }

  initForm(data?) {
    let array = [];
    if(data.NAME) {
      data.NAME.split(',').forEach(n => array.push(this.initEmpno(n.trim())));
    }else {
      array.push(this.initEmpno());
    }
    this.scheduleForm = this.fb.group({
      SCHEDULE_NAME: [data.SCHEDULE_NAME],
      AREA: [data.AREA],
      FROM_DATE: [data.FROM_DATE],
      FROM_TIME: [data.FROM_TIME],
      TO_TIME: [data.TO_TIME],
      empnos: this.fb.array(array)
    })
  }

  initEmpno(val?) {
    return this.fb.group({person: [val]})
  }

  cancleEmp(i) {
    const empnos = this.scheduleForm.get('empnos') as FormArray;
    empnos.removeAt(i);
  }

  addEmp() {
    const empnos = this.scheduleForm.get('empnos') as FormArray;
    empnos.push(this.initEmpno());
  }

  submitForm() {
    console.log(this.scheduleForm.value)
  }
  getDataDrive2(d: DataDrive) {
    d.addDefaultSearchParams({ nameID: 2 });
    d.beforeInitTableData((data) => this.combineSameHeader(data));
    d.changeUpdateViewer((d) => {
      this.initForm(d);
      this.isVisible = true;
    })
  }

  getDataDrive3(d: DataDrive) {
    d.addDefaultSearchParams({ nameID: 3 });
    d.beforeInitTableData((data) => this.combineSameHeader(data));
    d.changeUpdateViewer((d) => {
      this.initForm(d);
      this.isVisible = true;
    })
  }

  getDataDrive4(d: DataDrive) {
    d.addDefaultSearchParams({ nameID: 4 });
    d.beforeInitTableData((data) => this.combineSameHeader(data));
    d.changeUpdateViewer((d) => {
      this.initForm(d);
      this.isVisible = true;
    })
  }

  combineSameHeader(data){
    let myData = [];
    while (data && data.length > 0) {
      let one = data.shift();
      if (data.length > 0) {
        let same = data.filter(d => d.SCHEDULE_HEADER_ID === one.SCHEDULE_HEADER_ID);
        if (same.length > 0) {
          same.forEach(s => one.NAME += ', ' + s.NAME);
          data = data.filter(d => d.SCHEDULE_HEADER_ID !== one.SCHEDULE_HEADER_ID);
        };
      }
      myData.push(one);
    };
    return myData;
  }

}
