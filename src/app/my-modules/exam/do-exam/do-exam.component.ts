import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Rx';
import { UtilService } from './../../../core/services/util.service';
import { NzModalService } from 'ng-zorro-antd';
import { ExamService, ExamResult } from './../shared/services/exam.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isArray } from '../../../shared/utils/index';

@Component({
  selector: 'app-do-exam',
  templateUrl: './do-exam.component.html',
  styleUrls: ['./do-exam.component.css'],
})
export class DoExamComponent implements OnInit, OnDestroy {
  examContent;
  examHeader;
  status = 2;
  translateTexts: any;
  sub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private confirmServ: NzModalService,
    private util: UtilService,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.sub = this.translateService
      .stream([
        'examModule.examOkTitle',
        'examModule.examOkContent',
        'examModule.examErrTitle',
        'examModule.examErrContent',
      ])
      .subscribe(_ => (this.translateTexts = _));
    this.route.params
      .concatMap(params => this.examService.getExamHeader(params.id))
      .subscribe(
        (d: any[]) => {
          const goBack = () => this.router.navigate(['/']);
          if (d && d.length > 0 && d[0].FLAG === 'Y') {
            const header = d[0];
            this.examHeader = {
              title: header.TITLE,
              name: this.examService.user.NICK_NAME,
              time: header.TIME,
              passScore: header.PASS_SCORE,
            };
            this.examService.getExamPaper(d[0].ID).subscribe(c => {
              const setContent = () => (this.examContent = c);
              this.confirmServ.confirm({
                nzTitle: this.translateTexts['examModule.examOkTitle'],
                nzContent: `<b>${
                  this.translateTexts['examModule.examOkContent']
                }</b>`,
                nzOnOk() {
                  setContent();
                },
                nzOnCancel() {
                  goBack();
                },
              });
            });
          } else {
            this.confirmServ.error({
              nzTitle: this.translateTexts['examModule.examErrTitle'],
              nzContent: this.translateTexts['examModule.examErrContent'],
              nzOnOk() {
                goBack();
              },
            });
          }
        },
        err => this.util.errDeal(err),
      );
  }

  ngOnDestroy() {
    if (this.sub instanceof Subscription) {
      this.sub.unsubscribe();
    }
  }

  sendResult(r: { answerList: any[]; lastMark: number }) {
    if (isArray(r.answerList) && r.answerList.length > 0) {
      const exam_id = r.answerList[0].EXAM_ID;
      const header: ExamResult = {
        EXAM_ID: exam_id,
        USER_ID: '',
        RESULT: r.lastMark,
        COMPANY_ID: '',
      };
      this.examService
        .updateExamResult(header)
        .concatMap(id => {
          const answerList = r.answerList.map(a => {
            a.RESULT_ID = id;
            return a;
          });
          return this.examService.updateExamAnswer(answerList);
        })
        .subscribe(
          res => {
            this.status = 4;
          },
          err => this.util.errDeal(err),
        );
    }
  }
}
