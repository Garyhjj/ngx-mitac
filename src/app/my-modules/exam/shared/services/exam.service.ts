import { EXAM_CONFIG } from './../tokens/exam.tokens';
import { UserState } from './../../../../core/store';
import { ExamMapping } from './../config/index';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { replaceQuery } from '../../../../shared/utils';

@Injectable()
export class ExamService {
  user: UserState;
  private _role = 3;
  get role() {
    if (this.checkPrivilege('admin')) {
      this._role = 1;
    } else if (this.checkPrivilege('leader')) {
      this._role = 2;
    }
    return this._role;
  }

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    @Inject(EXAM_CONFIG)
    private examConfig: {
      UpdateMapping: string;
      getExamPaper: string;
      getExamHeader: string;
      updateExamResult: string;
      updateExamAnswer: string;
    },
  ) {
    this.user = this.auth.user;
  }

  updateMapping(data: ExamMapping) {
    data.COMPANY_ID = this.user.COMPANY_ID;
    return this.http.post(this.examConfig.UpdateMapping, data);
  }

  checkPrivilege(role: string) {
    return this.auth.hasPrivilege('EXAM', role);
  }

  getExamPaper(id: number) {
    const send = {
      exam_id: id,
      company_id: this.user.COMPANY_ID,
    };
    return this.http.get(replaceQuery(this.examConfig.getExamPaper, send));
  }

  getExamHeader(id: number) {
    const send = {
      id: id,
      company_id: this.user.COMPANY_ID,
    };
    return this.http.get(replaceQuery(this.examConfig.getExamHeader, send));
  }

  updateExamResult(res: ExamResult) {
    const add = { COMPANY_ID: this.user.COMPANY_ID, USER_ID: this.user.ID };
    Object.assign(res, add);
    return this.http.post(this.examConfig.updateExamResult, res);
  }

  updateExamAnswer(res: ExamAnswer[]) {
    return this.http.post(this.examConfig.updateExamAnswer, res);
  }
}

export interface ExamResult {
  EXAM_ID: number;
  ID?: number;
  USER_ID: string;
  RESULT: number;
  COMPANY_ID: string;
}

export interface ExamAnswer {
  EXAM_ID: number;
  QUESTION_ID: number;
  ANSWERS: string;
  RESULT_ID: number;
}
