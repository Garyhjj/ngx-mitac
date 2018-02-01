import { Subscription } from 'rxjs/Subscription';
import { UtilService } from './../../../../../core/services/util.service';
import { DataDrive, TableDataColumn } from './../../shared/models/index';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { NzModalSubject } from 'ng-zorro-antd';
import { SearchItemSet } from '../../shared/models/searcher/index';
import { NgxValidatorExtendService } from '../../../../../core/services/ngx-validator-extend.service';
import { DataDriveService } from '../../core/services/data-drive.service';



@Component({
  selector: 'app-data-update',
  templateUrl: './data-update.component.html',
  styleUrls: ['./data-update.component.css']
})
export class DataUpdateComponent implements OnInit, OnDestroy {


  dataDrive: DataDrive;
  columns: TableDataColumn[];
  updateSets: SearchItemSet[];
  columnNameStrings: string[];
  notPrimarySets: SearchItemSet[];
  inputTypeList: any[];
  errMes: any = {};
  primaryKey: string;
  primaryValue: number;
  formLayout = 'horizontal';
  globalErr;
  sub1: Subscription
  @Input()
  set opts(opts: DataDrive) {
    if (!opts) {
      return;
    }
    this.dataDrive = opts;
    this.updateSets = opts.updateSets;
    this.columns = opts.tableData.columns;
    this.notPrimarySets = this.updateSets.filter(u => {
      if (u.InputOpts.type !== 'primary') {
        return true;
      } else {
        this.primaryKey = u.property;
        this.primaryValue = !Number.isNaN(+u.InputOpts.default)? u.InputOpts.default as number : -1;
        return false;
      }
    });
    this.columnNameStrings = this.notPrimarySets.map(c => c.property);
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
    private validExd: NgxValidatorExtendService,
    private dataDriveService: DataDriveService,
    private util: UtilService
  ) {
  }

  submitForm() {
    if(!this.dataDrive.runBeforeUpdate()) return;
    const value = this.validateForm.value;
    const cascaderProps = this.inputTypeList.filter(i => i.type === 'cascader').map(t => t.label);
    cascaderProps.forEach(c => {
      const cascaderProp = value[c];
      cascaderProp && Object.assign(value, cascaderProp);
      delete value[c];
    })
    if (this.primaryKey) {
      value[this.primaryKey] = this.primaryValue;
    }
    this.dataDriveService.updateData(this.dataDrive, value).subscribe(c => {
      this.dataDriveService.updateViewData(this.dataDrive);
      this.util.showGlobalSucMes(this.changeIdx < 0?'插入成功': '更新成功');
      setTimeout(() => this.subject1.destroy(), 500);
    },(err) => this.util.errDeal(err))
  }

  subscribeGlErr() {
    this.sub1 = this.dataDrive.observeGlobalUpdateErr().subscribe((err) => this.globalErr = err);
  }

  ngOnDestroy() {
    this.sub1 && this.sub1.unsubscribe();
  }
  ngOnInit() {
    if (!this.dataDrive) {
      return;
    }
    const myForm: any = {};
    this.inputTypeList = this.notPrimarySets.filter(u => u.InputOpts.type !== 'primary').map(s => {
      let def: any = '';
      if (this.changeIdx > -1) {
        const data = this.dataDrive.tableData && this.dataDrive.tableData.data[this.changeIdx];
        if (data) {
          const target = data.find(d => d.property === s.property);
          if (target) {
             const primary = data.find(d => d.property === this.primaryKey);
             if(primary) {
               this.primaryValue = +primary.value;
             }
            def = target.value;
          }
        }
      } else {
        def = (s.InputOpts && s.InputOpts.default) || '';
      }
      const mapColumn = this.columns.find(c => c.property === s.property);
      const match = s.InputOpts.match;
      let valid = null;
      if (match) {
        if (match.err) {
          this.errMes[s.property] = match.err;
        }
        if (match.regexp) {
          valid = this.validExd.regex(match.regexp);
        }
      }
      myForm[s.property] = [def, valid];
      return Object.assign({ label: mapColumn ? mapColumn.value : s.property }, s.InputOpts);
    });
    // console.log(this.inputTypeList);
    // this.dataDrive.onUpdateFormShow((fg) => {
    //   console.log(fg.value);
    // })
    this.validateForm = this.fb.group(myForm);
    this.subscribeGlErr();
    this.dataDrive.updateFormGroupInited(this.validateForm);
  }

}
