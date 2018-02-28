import { stringify, sortUtils, parse } from './../../../shared/utils/index';
import { TableData } from './../../../shared/components/data-drive/shared/models/table-data/index';
import { DataDriveOptions, DataDrive } from './../../../shared/components/data-drive/shared/models/index';
import { AdditionalFn } from './../../../shared/components/data-drive/shared/models/additionalFn/index';
import { NgxValidatorExtendService } from './../../../core/services/ngx-validator-extend.service';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataDriveStore } from '../../../shared/components/data-drive/shared/config';
import { isArray, deepClone } from '../../../shared/utils';

@Component({
  selector: 'app-drive-edit',
  templateUrl: './drive-edit.component.html',
  styleUrls: ['./drive-edit.component.css']
})
export class DriveEditComponent implements OnInit {

  @ViewChild('styleForm') styleForm: TemplateRef<void>;
  @ViewChild('nzTabBarExtraContentUpdateSets') nzTabBarExtraContentUpdateSets: TemplateRef<void>;
  @ViewChild('nzTabBarExtraContentRule') nzTabBarExtraContentRule: TemplateRef<void>;
  @ViewChild('nzTabBarExtraContentView') nzTabBarExtraContentView: TemplateRef<void>;
  @ViewChild('nzTabBarExtraContentTable') nzTabBarExtraContentTable: TemplateRef<void>
  preViewSetting;
  formLayout = 'horizontal';
  setForm: FormGroup;

  otherInputSetTip;
  otherInputSetTipList = {
    primary: '無',
    text: '{"editable": true}',
    textarea: '{"editable": true}',
    select: `
    {
      "options": [{ "property": "IPQA", value: "IPQA巡檢" }],
      "lazyAPI": "IPQA/XXX?company={company}" // 當不能提供options時，向網絡懶加載
      "lazyParams": ["TYPE", "DESCRIPTION"] //第一個參數是form獲得的表單值，後一個是顯示的文字
      "lazyAPIUserMes"： {"company": "COMPANY_ID"} //API需要當前用戶信息時,屬性key是替換的參數，value是user對象的屬性，可在localStorage里查看
    }`,
    checkbox: `
    {
      "options": [{ "property": "IPQA", value: "IPQA巡檢" }],
    }
    `,
    datePicker: `
    {
      "pickerFormat": "YYYY/MM/DD HH:mm", //就是表單獲得的日期格式
      "showFormat": "YYYY/MM/DD HH:mm", //控件顯示的日期格式
      "showTime": false, //是否可選擇時分秒
      "showMode"： "Day" //選擇到什麼位置,這是可選擇到天 day | month
    }
    `,
    timePicker: `
    {
      "pickerFormat": "HH:mm", //就是表單獲得的日期格式
      "showFormat": "HH:mm:ss", //控件顯示的日期格式
    }
    `,
    number: `
    {
      "max": 100,//最大值
      "min": 10,//最小值
      "step": 5// 每次變化數（按鈕）
    }
    `,
    switch: `
    {
      "trueFormat": "Y", //開的值
      "falseFormat": "N" //關的值
    }
    `,
    colleagueSearcher: '無',
    photoUpload: `
    {
      pickerFormat: "string", // 表單獲得的格式 string | array
      maxCount: 9, //圖片最大數
      removable: true, //是否可刪除圖片
      addable: true, //是否可刪除圖片
      scanable: true //是否可放大瀏覽圖片
    }
    `

  };
  sortWayOptions = ((d) => {
    let options = [{ property: '-1', value: '不設置' }];
    for (let prop in d) {
      options.push({ property: prop, value: prop });
    }
    return options;
  })(sortUtils);
  inputTypeOptions = [
    { property: 'primary', value: '定義為主鍵(不會顯示,但提交時會帶上)' },
    { property: 'text', value: '普通Input' },
    { property: 'textarea', value: '長文本Input' },
    { property: 'number', value: '數字' },
    { property: 'datePicker', value: '日期' },
    { property: 'timePicker', value: '時間（HH:mm:ss）' },
    { property: 'select', value: '單選' },
    { property: 'checkbox', value: '多選' },
    { property: 'switch', value: '開關' },
    { property: 'colleagueSearcher', value: '員工搜索' },
    { property: 'photoUpload', value: '圖片上傳' }
  ]
  pipeOptions = [
    { property: '-1', value: '不設置' },
    { property: 'replace', value: '簡單替換' },
    { property: 'lazyLoad', value: '網絡請求后替換' },
    { property: 'date', value: '日期格式化' }
  ];
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

  example: any = DataDriveStore.examQuestions;
  constructor(
    private fb: FormBuilder,
    private validatorExtendService: NgxValidatorExtendService
  ) { }

  ngOnInit() {
    let e = JSON.parse(JSON.stringify(this.example));
    this.initForm(new DataDrive(e));
  }

  indexChange(i) {
    console.log(i);
    if (i === 0) {
      this.preViewSetting = null;
    } else if (i === 1) {
      const val = this.setForm.value;
      const setting = new DataDriveSetting(val);
      setTimeout(() => {
        this.preViewSetting = setting;
      }, 500)

    }
  }
  settingConvertToForm(e) {
    if (typeof e === 'object') {
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
    const tableData = formData.tableData || {};
    const columns = tableData.columns;
    const columnFormList = [];
    if (isArray(columns)) {
      if (columns.length > 0) {
        columns.forEach(c => columnFormList.push(this.initColumnForm(c)));
      } else {
        columnFormList.push(this.initColumnForm());
      }
    }
    const updateSetsFormList = [];
    if (isArray(formData.updateSets)) {
      const updateSets = formData.updateSets;
      updateSets.forEach(c => {
        updateSetsFormList.push(this.initUpdateSetForm(c));
      });
    }
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
      dataViewSetList: new FormArray([this.initViewSetForm(formData.dataViewSetList && formData.dataViewSetList[0])]),
      tableData: this.fb.group({
        searchable: [tableData.searchable],
        addable: [tableData.addable],
        deletable: [tableData.deletable],
        editable: [tableData.editable],
        isCompanyLimited: [false],
        defaultSearchParams: [stringify(tableData.defaultSearchParams)],
        columns: new FormArray(columnFormList)
      }),
      updateSets: new FormArray(updateSetsFormList)
    });
    const tableDataForm = this.setForm.get('tableData') as FormGroup;
    tableDataForm.get('isCompanyLimited').valueChanges.subscribe(v => {
      if (v) {
        tableDataForm.addControl('companyBindName', new FormControl(''));
      } else {
        tableDataForm.removeControl('companyBindName');
      }
    });
    tableData.isCompanyLimited && tableDataForm.get('isCompanyLimited').setValue(true)
      && tableDataForm.get('companyBindName').setValue(tableData.isCompanyLimited);
  }

  initUpdateSetForm(d: any = {}) {
    const form = this.fb.group({
      property: [d.property],
      InputOpts: this.fb.group({
        type: [d.InputOpts && d.InputOpts.type],
        placeHolder: [d.InputOpts && d.InputOpts.placeHolder],
        match: [d.InputOpts && d.InputOpts.match && stringify(d.InputOpts.match)],
        more: [d.InputOpts && d.InputOpts.more && stringify(d.InputOpts.more)]
      })
    });
    const InputOpts = form.get('InputOpts');
    InputOpts['myTips'] = this.otherInputSetTipList[d.InputOpts && d.InputOpts.type];
    InputOpts.get('type').valueChanges.subscribe(v => {
      InputOpts['myTips'] = this.otherInputSetTipList[v];
    });
    return form;
  }

  newUpdateSetTab(fa: FormArray) {
    fa.push(this.initUpdateSetForm());
  }

  initColumnForm(d: any = {}) {
    const form = this.fb.group({
      property: [d.property],
      value: [d.value],
      sortByName: [d.more && d.more.sortBy && d.more.sortBy.name],
      sortByParams: [d.more && d.more.sortBy && stringify(d.more.sortBy.params)],
      pipeName: [d.more && d.more.pipe && d.more.pipe.name],
      pipeParams: [d.more && d.more.pipe && stringify(d.more.pipe.params)]
    });
    return form;
  }
  closeTab(fa: FormArray, idx: number) {
    this.closeColumnTab(fa, idx);
  }
  closeColumnTab(fa: FormArray, idx: number) {
    fa.removeAt(idx);
  }

  newColumnTab(fa: FormArray) {
    fa.push(this.initColumnForm())
  }

  initViewSetForm(viewSet: any = {}) {
    const form = this.fb.group({
      type: ['', this.validatorExtendService.required()],
    });
    form.get('type').valueChanges.subscribe(t => {
      const controls = form.controls;
      for (let prop in controls) {
        if (prop !== 'type') {
          form.removeControl(prop)
        }
      }
      switch (t) {
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

  initTableViewSetForm(fg: FormGroup, d: any = {}) {
    const more = d.more || {};
    fg.addControl('showAction', new FormControl(more.showAction || false));
    fg.addControl('title', new FormControl(d.title || ''));
    fg.addControl('pageSet', new FormControl(false));
    fg.addControl('border_y', new FormControl(more.border_y && more.border_y.enable || false));
    fg.addControl('header', this.fb.group({
      textColor: [more.header && more.header.textColor],
      bgColor: [more.header && more.header.bgColor],
      textSize: [more.header && more.header.textSize]
    }));
    if (more.pageSet && more.pageSet.enable) {
      fg.get('pageSet').setValue(true);
      fg.addControl('pageCount', new FormControl(more.pageSet.count));
    }
    fg.get('pageSet').valueChanges.subscribe(v => {
      if (v) {
        fg.addControl('pageCount', new FormControl(10));
      } else {
        fg.removeControl('pageCount');
      }
    })
    let ruleFormList = []
    if (more.body && isArray(more.body.rules) && more.body.rules.length > 0) {
      const rules = more.body.rules;
      rules.forEach(c => {
        ruleFormList.push(this.initRuleForm(c));
      })
    } else {
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
      if (v) {
        fixedHeader.addControl('scrollHeight', new FormControl(fixedHeaderData.scrollHeight || 'auto', this.validatorExtendService.required()));
        fixedHeader.addControl('autoScroll', new FormControl(false));
        fixedHeader.get('autoScroll').valueChanges.subscribe(a => {
          if (a) {
            fixedHeader.addControl('interval', new FormControl(fixedHeaderData.autoScroll && fixedHeaderData.autoScroll.interval || 2000));
            fixedHeader.addControl('loop', new FormControl(fixedHeaderData.autoScroll && fixedHeaderData.autoScroll.loop || true));
          } else {
            fixedHeader.removeControl('interval');
            fixedHeader.removeControl('loop');
          }
        })
      } else {
        fixedHeader.removeControl('interval');
        fixedHeader.removeControl('loop');
        fixedHeader.removeControl('autoScroll');
        fixedHeader.removeControl('scrollHeight');
      }
    })
    fixedHeader.get('enable') && fixedHeader.get('enable').setValue(fixedHeaderData.enable);
    fixedHeader.get('autoScroll') && fixedHeader.get('autoScroll').setValue(fixedHeaderData.autoScroll ? true : false);
    fg.addControl('fixedHeader', fixedHeader);

  }

  closeRuleTab(rules: FormArray, idx) {
    rules.removeAt(idx);
  }
  newRuleTab(rules: FormArray) {
    rules.push(this.initRuleForm())
  }

  initRuleForm(d: any = {}) {
    return this.fb.group({
      matches: [d.matches && JSON.stringify(d.matches)],
      textColor: [d.textColor],
      bgColor: [d.bgColor],
      textSize: [d.textSize]
    })
  }
  submitForm() {
    window['aaa'] = this.setForm;
    console.log(this.setForm.value, this.setForm);
    const val = this.setForm.value;
    const send = new DataDriveSetting(val);
    console.log(send, this.example);
  }

}

class DataDriveSetting {
  id;
  APIs;
  additionalFn;
  dataViewSet;
  tableData;
  constructor(d) {
    d = JSON.parse(JSON.stringify(d));
    this.id = d.id;
    this.getAPiIs(d);
    this.getAdditionalFn(d);
    this.getDataViewSet(d);
    this.getTableData(d);
    this.clearNull(this);
  }

  getTableData(d) {
    const before = d.tableData;
    if (typeof before === 'object') {
      if (before.isCompanyLimited && typeof before.companyBindName === 'string' && before.companyBindName) {
        before.isCompanyLimited = before.companyBindName;
        delete before.companyBindName;
      }
      if (before.defaultSearchParams) {
        before.defaultSearchParams = parse(before.defaultSearchParams);
      }
      this.tableData = before;
      if (isArray(this.tableData.columns)) {
        const columns = this.tableData.columns;
        columns.forEach(c => {
          if (c.sortByName) {
            c.more = c.more || {};
            c.more.sortBy = {
              name: c.sortByName + '',
              params: parse(c.sortByParams)
            }
            delete c.sortByName;
            delete c.sortByParams;
          }
          if (c.pipeName) {
            c.more = c.more || {};
            c.more.pipe = {
              name: c.pipeName + '',
              params: parse(c.pipeParams)
            }
            delete c.pipeName;
            delete c.pipeParams;
          }
        });
      }
    }
  }

  getDataViewSet(d) {
    if (isArray(d.dataViewSetList) && d.dataViewSetList.length > 0) {
      const before = d.dataViewSetList[0];
      if (typeof before !== 'object') return;
      this.dataViewSet = this.dataViewSet || {};
      this.dataViewSet.title = before.title + '';
      this.dataViewSet.type = before.type + '';
      this.dataViewSet.more = before;
      const more = this.dataViewSet.more;
      delete more.type;
      delete more.title;
      if (more.pageSet) {
        more.pageSet = { enable: true, count: more.pageCount ? more.pageCount : 10 };
        delete more.pageCount;
      } else {
        delete more.pageSet;
      }
      if (more.border_y) {
        more.border_y = { enable: true };
      } else {
        delete more.border_y;
      }
      if (more.body) {
        if (isArray(more.body.rules)) {
          const rules = more.body.rules;
          rules.forEach(r => {
            if (r.matches) {
              r.matches = JSON.parse(r.matches);
            }
          })
        }
      }
      if (more.fixedHeader) {
        if (!more.fixedHeader.enable) {
          delete more.fixedHeader.enable;
          return;
        }
        more.pageSet = { enable: false }
        if (more.fixedHeader.autoScroll) {
          more.fixedHeader.autoScroll = {};
          const autoScroll = more.fixedHeader.autoScroll;
          autoScroll.interval = more.fixedHeader.interval ? more.fixedHeader.interval : 2000;
          autoScroll.loop = more.fixedHeader.loop ? true : false;
          delete more.fixedHeader.interval;
          delete more.fixedHeader.loop;
        }
      }
    }
  }

  clearNull(o, parent?) {
    if (isArray(o)) {
      if (o.length > 0) {
        for (let idx = 0; idx < o.length; idx++) {
          if (typeof o[idx] === 'object') {
            this.clearNull(o[idx], parent);
          }
        }
      }
    } else if (typeof o === 'object') {
      for (let prop in o) {
        const value = o[prop];
        if (value === '' || value === void (0) || value === null) {
          delete o[prop];
          parent && this.clearNull(parent);
        } else if (isArray(value)) {
          if (value.length > 0) {
            for (let idx = 0; idx < value.length; idx++) {
              if (typeof value[idx] === 'object') {
                const v = value[idx];
                if (Object.keys(v).length === 0) {
                  value.splice(idx, 1);
                  if (value.length === 0) {
                    delete o[prop];
                    break;
                  }
                } else {
                  this.clearNull(v, value);
                }
              }
            }
          } else {
            delete o[prop];
          }
        } else if (typeof value === 'object') {
          if (Object.keys(value).length === 0) {
            delete o[prop];
            parent && this.clearNull(parent);
          } else {
            this.clearNull(value, o);
          }
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