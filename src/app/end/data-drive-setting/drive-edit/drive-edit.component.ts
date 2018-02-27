import { DataDriveOptions } from './../../../shared/components/data-drive/shared/models/index';
import { AdditionalFn } from './../../../shared/components/data-drive/shared/models/additionalFn/index';
import { NgxValidatorExtendService } from './../../../core/services/ngx-validator-extend.service';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DataDriveStore } from '../../../shared/components/data-drive/shared/config';
import { isArray } from '../../../shared/utils';

@Component({
  selector: 'app-drive-edit',
  templateUrl: './drive-edit.component.html',
  styleUrls: ['./drive-edit.component.css']
})
export class DriveEditComponent implements OnInit {
  formLayout = 'horizontal';
  setForm: FormGroup;

  additionalFnOptions = [
    { property: 'changeBodyFontSize', value: '表格數據字體大小調整' },
    { property: 'changeHeaderFontSize', value: '表格列名字體大小調整' },
    { property: 'menu', value: '菜單' },
    { property: 'toExcel', value: '導出Excel' },
    { property: 'addItem', value: '新增數據' },
    { property: 'filterColumn', value: '挑選列' },
    { property: 'fullScreen', value: '視圖全屏顯示' }
  ];

  viewTypeOptions = [
    { property: 'table', value: '表格' },
    { property: 'exam', value: '考卷' }
  ]

  example = DataDriveStore.urgentMaterial;
  constructor(
    private fb: FormBuilder,
    private validatorExtendService: NgxValidatorExtendService
  ) { }

  ngOnInit() {
    this.initForm(this.example);
  }

  settingConvertToForm(e) {
    if (typeof e === 'object') {
      e = JSON.parse(JSON.stringify(e));
      if (e.additionalFn) {
        const additionalFn = e.additionalFn;
        e.additionalFn = {};
        for (let prop in additionalFn) {
          if (prop === 'switchViewType') {
            if (isArray(additionalFn[prop])) {
              e.additionalFn.switchViewType = additionalFn[prop].join(',')
            }
          } else if (additionalFn[prop] === true) {
            e.additionalFn.others = e.additionalFn.others || [];
            e.additionalFn.others.push(prop);
          }
        }
        if (isArray(e.additionalFn)) {
          e.additionalFn = e.additionalFn.join(',');
        }
      }

      e.dataViewSetList = [];
      e.dataViewSet && e.dataViewSetList.push(e.dataViewSet);
      e.otherDataViewSets && e.dataViewSetList.concat(e.otherDataViewSets);
      return e;
    }
    return null;
  }

  initForm(setting?) {
    const formData = this.settingConvertToForm(setting) || {};
    this.setForm = this.fb.group({
      id: [formData.id],
      APIs: this.fb.group({
        search: [formData.APIs && formData.APIs.search, this.validatorExtendService.required()],
        update: [formData.APIs && formData.APIs.update],
        delete: [formData.APIs && formData.APIs.delete]
      }),
      additionalFn: this.fb.group({
        switchViewType: [formData.additionalFn && formData.additionalFn.switchViewType],
        others: [formData.additionalFn && formData.additionalFn.others]
      }),
      dataViewSetList: new FormArray([this.initViewSetForm(formData.dataViewSetList && formData.dataViewSetList[0])])
    })
  }

  initViewSetForm(viewSet:any = {}) {
    const form = this.fb.group({
      type: ['', this.validatorExtendService.required()],
    });
    form.get('type').valueChanges.subscribe(t => {
      const controls = form.controls;
        for(let prop in controls) {
          if(prop !== 'type') {
            form.removeControl(prop)
          }
        }
      switch(t) {
        case 'table':
        this.initTableViewSetForm(form, viewSet);
      }
    });
    form.get('type').setValue(viewSet.type || 'table');
    return form;
  }

  closeViewSetTab(idx) {
    const dataViewSetList = this.setForm.get('dataViewSetList') as FormArray;
    dataViewSetList.removeAt(idx);
  }

  newViewSetTab() {
    const dataViewSetList = this.setForm.get('dataViewSetList') as FormArray;
    dataViewSetList.push(this.initViewSetForm());
  }

  initTableViewSetForm(fg: FormGroup, d:any = {}) {
    const more = d.more || {};
    fg.addControl('showAction', new FormControl(more.showAction ||  false));
    fg.addControl('title', new FormControl(d.title || ''));
    fg.addControl('pageSet', new FormControl(more.pageSet ||  false));
    fg.addControl('border_y', new FormControl(more.pageSet ||  false));
    fg.addControl('header', this.fb.group({
      textColor: [more.header && more.header.textColor],
      bgColor: [more.header && more.header.bgColor],
      textSize: [more.header && more.header.textSize]
    }));
    let ruleFormList = []
    if(isArray(more.body.rules) && more.body.rules.length > 0) {
      const rules = more.body.rules;
      rules.forEach(c => {
        ruleFormList.push(this.initRuleForm(c));
      })
    }else {
      ruleFormList.push(this.initRuleForm())
    }
    const body = this.fb.group({
      textColor: [more.body && more.body.textColor],
      bgColor: [more.body && more.body.bgColor],
      textSize: [more.body && more.body.textSize],
      rules: new FormArray(ruleFormList)
    });
    fg.addControl('body', body);
    const fixedHeader = this.fb.group({
      enable: [false]
    })
    const fixedHeaderData = more.fixedHeader || {};
    fixedHeader.get('enable').valueChanges.subscribe(v => {
      if(v) {
        fixedHeader.addControl('scrollHeight', new FormControl(fixedHeaderData.scrollHeight || 'auto', this.validatorExtendService.required()));
        fixedHeader.addControl('autoScroll', new FormControl(false));
        fixedHeader.get('autoScroll').valueChanges.subscribe(a => {
          if(a) {
            fixedHeader.addControl('interval', new FormControl(fixedHeaderData.autoScroll && fixedHeaderData.autoScroll.interval || 2000));
            fixedHeader.addControl('loop', new FormControl(fixedHeaderData.autoScroll && fixedHeaderData.autoScroll.loop || true));
          }else {
            fixedHeader.removeControl('interval');
            fixedHeader.removeControl('loop');
          }
        })
      }else {
        fixedHeader.removeControl('interval');
        fixedHeader.removeControl('loop');
        fixedHeader.removeControl('autoScroll');
        fixedHeader.removeControl('scrollHeight');
      }
    })
    fixedHeader.get('enable').setValue(fixedHeaderData.enable);
    fixedHeader.get('autoScroll').setValue(fixedHeaderData.autoScroll? true: false);
    fg.addControl('fixedHeader', fixedHeader);

  }

  closeRuleTab(rules: FormArray, idx) {
    rules.removeAt(idx);
  }
  newRuleTab(rules: FormArray) {
    rules.push(this.initRuleForm())
  }

  initRuleForm(d:any = {}) {
    return this.fb.group({
      matches:[d.matches && JSON.stringify(d.matches)],
      textColor: [d.textColor],
      bgColor: [d.bgColor],
      textSize: [d.textSize]
    })
  }
  submitForm() {
    window['aaa'] = this.setForm;
    console.log(this.setForm.value, this.setForm);
    const val = this.setForm.value;
    console.log(new DataDriveSetting(val));
  }

}

class DataDriveSetting {
  APIs;
  additionalFn;
  dataViewSet;
  constructor(d) {
    this.getAPiIs(d);
    this.getAdditionalFn(d);
    this.getDataViewSet(d);
  }

  getDataViewSet(d) {
    if(isArray(d.dataViewSetList) && d.dataViewSetList.length > 0) {
      const before = d.dataViewSetList[0];
      if(typeof before !== 'object') return;
      this.dataViewSet = this.dataViewSet || {};
      this.dataViewSet.title = before.title;
      this.dataViewSet.type = before.type;
      this.dataViewSet.more = before;
      const more = this.dataViewSet.more;
      delete more.type;
      delete more.title;
      more.pageSet = {enable: more.pageSet?true:false};
      more.border_y = {enable: more.border_y?true:false};
      this.clearNull(more.header);
      if(more.body) {
        this.clearNull(more.body);
        if(isArray(more.body.rules)) {
          const rules = more.body.rules;
          rules.forEach(r => {
            this.clearNull(r);
            if(r.matches) {
              r.matches = JSON.parse(r.matches);
            }
          })
        }
      }
      if(more.fixedHeader) {
        if(more.fixedHeader.autoScroll) {
          more.fixedHeader.autoScroll = {};
          const autoScroll = more.fixedHeader.autoScroll;
          autoScroll.interval = more.fixedHeader.interval? more.fixedHeader.interval: 2000;
          autoScroll.loop = more.fixedHeader.loop? true: false;
          delete more.fixedHeader.interval;
          delete more.fixedHeader.loop;
        }
      }

    }
  }

  clearNull(o) {
    if(typeof o === 'object') {
      for (let prop in o) {
        if (!o[prop]) {
          delete o[prop];
        }
      }
    }
  }

  getAPiIs(d) {
    if (d.APIs) {
      const before = d.APIs;
      this.clearNull(before);
      this.APIs = before;
    }
  }
  getAdditionalFn(d) {
    if (d.additionalFn) {
      const before = d.additionalFn;
      if (before.others) {
        this.additionalFn = this.additionalFn || {};
        before.others.split(',').forEach(c => {
          this.additionalFn[c] = true;
        })
      }
      if (before.switchViewType) {
        this.additionalFn = this.additionalFn || {};
        this.additionalFn.switchViewType = before.switchViewType.split(',')
      }
    }
  }
}