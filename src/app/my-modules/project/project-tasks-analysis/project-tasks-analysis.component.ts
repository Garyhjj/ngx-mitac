import { TranslateService } from '@ngx-translate/core';
import { UtilService } from './../../../core/services/util.service';
import { TableDataColumn } from './../../../shared/components/data-drive/shared/models/table-data/index';
import { ProjectLine } from './../shared/models/index';
import { map } from 'rxjs/operators';
import { DataDrive } from './../../../shared/components/data-drive/shared/models/index';
import { NgxValidatorExtendService } from './../../../core/services/ngx-validator-extend.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { isArray } from '../../../shared/utils';
import { merge, forkJoin, Subscription } from 'rxjs';
import { ProjectService } from '../shared/services/project.service';

@Component({
  selector: 'app-project-tasks-analysis',
  templateUrl: './project-tasks-analysis.component.html',
  styleUrls: ['./project-tasks-analysis.component.css'],
})
export class ProjectTasksAnalysisComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  ownerLists: string[];
  dataDrive: DataDrive;
  rate: number;
  pipeRawOption = {
    title: {
      text: '达成率',
      textStyle: {
        fontSize: 18,
      },
      x: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : <br/>{c} ({d}%)',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      height: '60%',
      containLabel: true,
    },
    legend: {
      orient: 'horizontal',
      top: '93%',
      itemGap: 4,
      textStyle: {
        fontSize: 13,
      },
      data: ['close（已完成)', '未完成 action'],
    },
    series: [
      {
        name: '',
        data: [
          {
            value: 3,
            name: 'close（已完成)',
            label: {
              normal: {
                formatter: '{b} \n {d}%',
              },
            },
          },
          {
            value: 1,
            name: '未完成 action',
            label: {
              normal: {
                formatter: '{b} \n {d}%',
              },
            },
          },
        ],
        type: 'pie',
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        roseType: false,
        radius: ['0%', '70%'],
      },
    ],
    textStyle: {
      fontFamily: [
        'Helvetica',
        'Tahoma',
        'Arial',
        'STXihei',
        '华文细黑',
        'Microsoft YaHei',
        '微软雅黑',
        'sans-serif',
      ],
    },
    color: ['#4f81bd', '#c0504d'],
  };
  pipeOption;
  barRawOption = `{"title":{"text":"未完成比率","textStyle":{},"x":"center"},"tooltip":{"trigger":"axis","formatter":"{b} : {c}%"},"legend":{"data":[""],"top":"7%","textStyle":{}},"grid":{"show":true,"containLabel":true},"xAxis":[{"type":"category","data":["o","n","g"],"axisTick":{"alignWithLabel":true}}],"yAxis":[{"max":100,"min":0,"type":"value","splitLine":{},"axisLabel":{"formatter":"{value}%"}}],"series":[{"name":"","type":"bar","yAxisIndex":0,"label":{"normal":{"show":true,"position":"top","formatter":"{c}%"}},"data":[{"value":"80"},{"value":"20"},{"value":"30"}],"barGap":0}],"textStyle":{"fontSize":18,"fontFamily":["Helvetica","Tahoma","Arial","STXihei","华文细黑","Microsoft YaHei","微软雅黑","sans-serif"]},"color":["#9bbb59"]}`;
  barOption;

  @ViewChild('chartBegin') chartBegin: ElementRef;

  translateTexts = {};
  sub: Subscription;

  headerCellStyle = (c: TableDataColumn) => {
    const property = c.property;
    switch (property) {
      case 'outTime':
        return {
          'background-color': '#D35854',
        };
      case 'notFinishAheadTime':
        return {
          'background-color': 'yellow',
        };
      case 'closed':
        return {
          'background-color': '#aacd61',
        };
    }
  };
  constructor(
    private fb: FormBuilder,
    private validatorExtendService: NgxValidatorExtendService,
    private projectService: ProjectService,
    private util: UtilService,
    private translateService: TranslateService,
  ) {}
  getTranslation() {
    this.sub = this.translateService
      .stream([
        'projectModule.analysisAll',
        'projectModule.CUSTOMER',
        'projectModule.BU',
        'projectModule.TYPE',
        'projectModule.MODEL',
      ])
      .subscribe(t => {
        this.translateTexts = t;
      });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  ngOnInit() {
    this.getTranslation();
    this.initForm();
  }

  initForm() {
    const form = this.fb.group({
      startDate: [],
      endDate: [],
      owner: [],
      mType: [
        '',
        [
          this.validatorExtendService.required(),
          // this.validatorExtendService.selfDefine((ctrl: AbstractControl) => {
          //   const value = ctrl.value;
          //   if (!value) {
          //     return null;
          //   }
          //   const tV = ctrl.parent.get(value).value;
          //   return tV
          //     ? null
          //     : {
          //         subRequired: true,
          //       };
          // }),
        ],
      ],
      customer: [],
      bu: [],
      type: [],
      model: [],
      assignee: [],
    });
    form.get('owner').valueChanges.subscribe(v => {
      if (v) {
        if (!isArray(this.ownerLists)) {
          this.ownerLists = [];
        }
        this.ownerLists.push(v);
        this.ownerLists = Array.from(new Set(this.ownerLists));
      }
    });
    merge(
      form.get('customer').valueChanges,
      form.get('bu').valueChanges,
      form.get('type').valueChanges,
      form.get('model').valueChanges,
      form.get('assignee').valueChanges,
    ).subscribe(() => {
      const tar = form.get('mType');
      tar.setValue(tar.value);
    });
    this.searchForm = form;
  }

  afterTabClose(o: string) {
    this.ownerLists = this.ownerLists.filter(l => l !== o);
  }

  submitForm() {
    const dismiss = this.util.showLoading2();
    const value = this.searchForm.value;
    const tapName: string = value['mType'];
    if (isArray(this.ownerLists) && this.ownerLists.length > 0) {
      forkJoin(
        this.ownerLists.map(l =>
          this.projectService.getAnalysisLines({
            startDate: value.startDate,
            endDate: value.endDate,
            [tapName]: value[tapName],
            owner: l,
          }),
        ),
      )
        .pipe(map((r: any[][]) => r.reduce((a, b) => a.concat(b), [])))
        .subscribe(
          res => {
            dismiss();
            const d = this.dataDrive;
            this.changeTapName(d, tapName);
            d.selfUpdateTableData(this.getAllTableData(res, tapName));
          },
          err => {
            this.util.errDeal(err);
            dismiss();
          },
        );
    } else {
      this.projectService
        .getAnalysisLines({
          startDate: value.startDate,
          endDate: value.endDate,
          [tapName]: value[tapName],
        })
        .subscribe(
          (res: ProjectLine[]) => {
            dismiss();
            const d = this.dataDrive;
            this.changeTapName(d, tapName);
            d.selfUpdateTableData(this.getAllTableData(res, tapName));
          },
          err => {
            this.util.errDeal(err);
            dismiss();
          },
        );
    }
  }

  changeTapName(d: DataDrive, tapName: string) {
    d.tableData.columns = d.tableData.columns.map(a => {
      if (a.property === 'tap') {
        a.value = this.translateTexts['projectModule.' + tapName.toUpperCase()];
      }
      return a;
    });
    d.selfHideLists = d.selfHideLists;
  }

  getAllTableData(res: ProjectLine[], tapName: string) {
    const data = [];
    if (isArray(res)) {
      const tap = {};
      tapName = tapName.toUpperCase();
      const nullValue = 'null';
      res.forEach(r => {
        const cus = r[tapName] ? r[tapName] : nullValue;
        tap[cus] = tap[cus] || [];
        tap[cus].push(r);
      });
      let nullData;
      for (let prop in tap) {
        if (tap.hasOwnProperty(prop)) {
          // TODO: 把空值数据放数组最后
          if (prop === nullValue) {
            nullData = this.getTableData(prop, tap[prop]);
          } else {
            data.push(this.getTableData(prop, tap[prop]));
          }
        }
      }
      if (nullData) {
        data.push(nullData);
      }
      data.push(
        this.getTableData(
          this.translateTexts['projectModule.analysisAll'],
          res,
        ),
      );
    }
    return data;
  }

  getTableData(tap: string, ls: ProjectLine[]) {
    const out: any = {};
    out.tap = tap;
    let outTime = 0,
      onGoing = 0,
      closed = 0;
    ls.forEach(l => {
      const status = l.STATUS;
      if (status === 'Closed') {
        closed++;
      } else {
        const dueDate = l.DUE_DATE;
        if (
          new Date(dueDate).getTime() +
            1000 * 60 * 60 * 24 -
            new Date().getTime() >
          0
        ) {
          onGoing++;
        } else {
          outTime++;
        }
      }
    });
    out.outTime = outTime;
    out.notFinishAheadTime = onGoing;
    out.closed = closed;
    out.total = ls.length;
    return out;
  }

  reSet() {
    this.searchForm.reset();
  }

  getDataDrive(d: DataDrive) {
    this.dataDrive = d;
    d.afterDataInit(data => {
      const total = data.pop();
      const tN = total.total;
      if (total && tN > 0) {
        this.rate = +((total.closed / tN) * 100).toFixed(2);
      } else {
        this.rate = -1;
      }
      this.initPipeChart(total.closed, tN);
      this.initBarChart(data);
      setTimeout(() => {
        this.chartBegin.nativeElement.scrollIntoView();
      }, 50);
    });
  }

  initPipeChart(closed: number, total: number) {
    if (total > 0) {
      const pipeRawOption: echarts.EChartOption = JSON.parse(
        JSON.stringify(this.pipeRawOption),
      );
      pipeRawOption.series.forEach((s: any) => {
        s.data[0].value = closed;
        s.data[1].value = total - closed;
      });
      this.pipeOption = pipeRawOption;
    } else {
      this.pipeOption = null;
    }
  }

  initBarChart(data: any[]) {
    data = data.filter(d => d.closed < d.total).map(d => {
      d.unDoneRate = +(((d.total - d.closed) * 100) / d.total).toFixed(2);
      return d;
    });
    if (data.length > 0) {
      data.sort((a, b) => a.unDoneRate - b.unDoneRate);
      const barRawOption = JSON.parse(this.barRawOption);
      barRawOption.xAxis = barRawOption.xAxis || [];
      barRawOption.xAxis[0] = barRawOption.xAxis[0] || {};
      barRawOption.xAxis[0].data = data.map(d => d.tap);
      barRawOption.series = barRawOption.series || [];
      barRawOption.series[0] = barRawOption.series[0] || ({} as any);
      barRawOption.series[0].data = data.map(d => {
        return d.unDoneRate;
      });
      this.barOption = barRawOption;
    } else {
      this.barOption = null;
    }
  }
}
