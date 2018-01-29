import { DataDrive, TableDataColumn } from './../../shared/models/index';
import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { NzModalSubject } from 'ng-zorro-antd';
import { SearchItemSet } from '../../shared/models/searcher/index';
import { NgxValidatorExtendService } from '../../../../../core/services/ngx-validator-extend.service';



@Component({
  selector: 'app-data-update',
  templateUrl: './data-update.component.html',
  styleUrls: ['./data-update.component.css']
})
export class DataUpdateComponent implements OnInit {

  
  dataDrive: DataDrive;
  columns: TableDataColumn[];
  updateSets: SearchItemSet[];
  columnNameStrings: string[];
  inputTypeList: any[];
  errMes:any = {};
  formLayout = 'horizontal';
  @Input()
  set opts(opts: DataDrive) {
    if (!opts) {
      return;
    }
    this.dataDrive = opts;
    this.updateSets = opts.updateSets;
    this.columns = opts.tableData.columns;
    this.columnNameStrings = this.updateSets.map(c => c.property);
  }
  @Input()
  changeIdx = -1;

  validateForm: FormGroup;

  get isHorizontal() {
    return this.formLayout === 'horizontal';
  }



  constructor(
    private fb: FormBuilder,
    private subject1: NzModalSubject,
    private validExd: NgxValidatorExtendService
  ) {
  }

  submitForm() {
    const value = this.validateForm.value;
    const cascaderProps = this.inputTypeList.filter(i => i.type === 'cascader').map(t => t.label);
    cascaderProps.forEach(c => {
      const cascaderProp = value[c];
      cascaderProp && Object.assign(value, cascaderProp);
      delete value[c];
    })
    setTimeout(() => this.subject1.destroy(),500);
    console.log(value);
  }

  ngOnInit() {
    // if (!this.dataDrive) {
    //   return;
    // }
    // const myForm: any = {};
    // this.inputTypeList = this.columns.map(c => {
    //   let def;
    //   if (this.changeIdx > -1) {
    //     const data = this.dataDrive.tableData && this.dataDrive.tableData.data[this.changeIdx];
    //     if (data) {
    //       const target = data.find(d => d.property === c.property);
    //       if (target) {
    //         def = target.value;
    //       }
    //     }
    //   }
    //   def = def || c.type.InputOpts.default;
    //   myForm[c.property] = [def];
    //   return Object.assign({ label: c.value }, c.type.InputOpts);
    // });
    // console.log(myForm);

    // this.validateForm = this.fb.group(myForm);
    if (!this.dataDrive) {
      return;
    }
    const myForm: any = {};
    this.inputTypeList = this.updateSets.map(s => {
      let def:any = '';
      if(this.changeIdx > -1) {
        const data = this.dataDrive.tableData && this.dataDrive.tableData.data[this.changeIdx];
        if (data) {
          const target = data.find(d => d.property === s.property);
          if (target) {
            def = target.value;
          }
        }
      }else {
        def = (s.InputOpts && s.InputOpts.default) || '';
      }
      const mapColumn = this.columns.find(c => c.property === s.property);
      const match = s.InputOpts.match;
      let valid = null;
      if(match) {
        if(match.err) {
          this.errMes[s.property] = match.err;
        }
        if(match.regexp) {
          valid = this.validExd.regex(match.regexp);
        }
      }
      myForm[s.property] = [def,valid];
      return Object.assign({ label: mapColumn?mapColumn.value:s.property }, s.InputOpts);
    });
    // console.log(this.inputTypeList);
    // this.dataDrive.onUpdateFormShow((fg) => {
    //   console.log(fg.value);
    // })
    this.validateForm = this.fb.group(myForm);
    this.dataDrive.updateFormGroupInited(this.validateForm);
  }

}
