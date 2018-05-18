import { Subscription } from 'rxjs/Subscription';
import { UtilService } from './../../../../../core/services/util.service';
import { DataDrive, TableDataColumn } from './../../shared/models/index';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchItemSet } from '../../shared/models/searcher/index';
import { NgxValidatorExtendService } from '../../../../../core/services/ngx-validator-extend.service';
import { DataDriveService } from '../../core/services/data-drive.service';
import { isArray } from '../../../../utils/index';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-data-update',
  templateUrl: './data-update.component.html',
  styleUrls: ['./data-update.component.css'],
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
  sub1: Subscription;
  private globalUpdateErrSubject = new Subject<string>();
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
        this.primaryValue = !Number.isNaN(+u.InputOpts.default)
          ? (u.InputOpts.default as number)
          : -1;
        return false;
      }
    });
    this.columnNameStrings = this.notPrimarySets.map(c => c.property);
  }
  @Input() changeIdx = -1;
  orinalData: any;
  validateForm: FormGroup;

  get isHorizontal() {
    return this.formLayout === 'horizontal';
  }

  constructor(
    private fb: FormBuilder,
    private validExd: NgxValidatorExtendService,
    private dataDriveService: DataDriveService,
    private util: UtilService,
  ) {}

  submitForm() {
    let out = {};
    if (
      !(out = this.dataDrive.runBeforeUpdateSubmit(
        this.validateForm,
        this.globalUpdateErrSubject,
        (() => {
          if (isArray(this.orinalData)) {
            this.orinalData.forEach(o => {
              out[o.property] = o.value;
            });
          }
          return out;
        })(),
      ))
    ) {
      return setTimeout(() => this.globalUpdateErrSubject.next(''), 3000);
    }
    const value = this.validateForm.value;
    const cascaderProps = this.inputTypeList
      .filter(i => i.type === 'cascader')
      .map(t => t.label);
    cascaderProps.forEach(c => {
      const cascaderProp = value[c];
      // tslint:disable-next-line:no-unused-expression
      cascaderProp && Object.assign(value, cascaderProp);
      delete value[c];
    });
    if (this.primaryKey) {
      value[this.primaryKey] = this.primaryValue;
    }
    const id = this.util.showLoading();
    const finalFn = () => this.util.dismissLoading(id);
    this.dataDriveService
      .updateData(this.dataDrive, Object.assign(value, out))
      .subscribe(
        c => {
          finalFn();
          this.dataDriveService.updateViewData(this.dataDrive);
          this.util.showGlobalSucMes(
            this.changeIdx < 0 ? '插入成功' : '更新成功',
          );
          // setTimeout(() => this.subject1.destroy(), 500);
        },
        err => {
          this.util.errDeal(err);
          finalFn();
        },
      );
  }

  subscribeGlErr() {
    this.sub1 = this.globalUpdateErrSubject.subscribe(
      err => (this.globalErr = err),
    );
  }

  ngOnDestroy() {
    // tslint:disable-next-line:no-unused-expression
    this.sub1 && this.sub1.unsubscribe();
  }
  ngOnInit() {
    if (!this.dataDrive) {
      return;
    }
    const myForm: any = {};
    this.inputTypeList = this.notPrimarySets
      .filter(u => u.InputOpts.type !== 'primary')
      .map(s => {
        let def: any = '';
        if (this.changeIdx > -1) {
          const data =
            this.dataDrive.tableData &&
            this.dataDrive.tableData.data[this.changeIdx];
          if (data) {
            this.orinalData = data;
            const target = data.find(d => d.property === s.property);
            if (target) {
              const primary = data.find(d => d.property === this.primaryKey);
              if (primary) {
                this.primaryValue = +primary.value;
              }
              def = target.value;
            } else {
              // 判断是否是级联组件，获得初始值
              const type = s.InputOpts.type;
              if (type === 'cascader') {
                const properties =
                  s.InputOpts.more && s.InputOpts.more.properties;
                if (isArray(properties)) {
                  def = '';
                  properties.forEach(p => {
                    if (typeof p === 'string') {
                      const target1 = data.find(d => d.property === p);
                      if (target1) {
                        const val = target1.value;
                        def += def ? ',' + val : val;
                      }
                    }
                  });
                }
              }
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
          if (isArray(match.fns)) {
            valid = [];
            match.fns.forEach(f => {
              const validFn = this.validExd[f.name];
              const validParmas = f.parmas || [];
              // tslint:disable-next-line:no-unused-expression
              validFn && valid.push(validFn(...validParmas));
            });
          }
        }
        myForm[s.property] = [def, valid];
        return Object.assign(
          {
            label: mapColumn ? mapColumn.value : s.property,
            property: s.property,
          },
          s.InputOpts,
        );
      });
    // this.dataDrive.onUpdateFormShow((fg) => {
    //   console.log(fg.value);
    // })
    this.validateForm = this.fb.group(myForm);
    this.subscribeGlErr();
    this.dataDrive.updateFormGroupInited(
      this.validateForm,
      this.globalUpdateErrSubject,
      this.inputTypeList,
    );
  }
}
