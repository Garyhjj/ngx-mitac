import { map } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { FormatService } from './../../../../core/services/format.service';
import { ProjectLine } from './../models/index';
import { projectConfig } from './../config/index';
import { HttpClient } from '@angular/common/http';
import { isArray, replaceQuery } from './../../../../shared/utils/index';
import { Injectable } from '@angular/core';

@Injectable()
export class ProjectService {
  constructor(private http: HttpClient, private formatService: FormatService) {}

  filterDataByDate(data) {
    let normal = [],
      outTime = [];
    if (isArray(data)) {
      data.forEach(l => {
        if (l.DUE_DATE) {
          if (
            new Date().getTime() -
              (new Date(l.DUE_DATE).getTime() + 1000 * 60 * 60 * 24) >
            0
          ) {
            outTime.push(l);
          } else {
            normal.push(l);
          }
        } else {
          normal.push(l);
        }
      });
    }
    return {
      normal,
      outTime,
    };
  }
  getTaskProgress(LINE_ID) {
    return this.http.get(
      replaceQuery(projectConfig.getTaskProgress, { LINE_ID }),
    );
  }

  deleteTaskProgress(ID) {
    return this.http.delete(
      replaceQuery(projectConfig.deleteTaskProgress, { ID }),
    );
  }

  updateTaskProgress(p) {
    p.ID = 0;
    return this.http.post(projectConfig.updateTaskProgress, p);
  }

  getTaskComments(LINE_ID) {
    return this.http.get(
      replaceQuery(projectConfig.getTaskComments, { LINE_ID }),
    );
  }

  deleteTaskComments(ID) {
    return this.http.delete(
      replaceQuery(projectConfig.deleteTaskComments, { ID }),
    );
  }

  updateTaskComments(p) {
    p.ID = 0;
    return this.http.post(projectConfig.updateTaskComments, p);
  }

  getProjectHistory(HEADER_ID, page = 1) {
    return this.http.get(
      replaceQuery(projectConfig.getProjectHistory, { HEADER_ID, page }),
    );
  }

  getProjecLine(id) {
    return this.http.get(replaceQuery(projectConfig.getProjecLine, { id }));
  }

  getProjectChildren(parent) {
    return this.http.get(
      replaceQuery(projectConfig.getProjectChildren, { parent }),
    );
  }

  getAllProject() {
    return this.http.get(projectConfig.getAllProject);
  }

  setProjectHeader(p) {
    return this.http.post(projectConfig.setProjectHeader, p);
  }

  getAnalysisLines(query) {
    return this.http.get(replaceQuery(projectConfig.getProjecLine, query));
  }

  getProjectPeople(header_id) {
    return this.http.get(
      replaceQuery(projectConfig.getProjectPeople, { header_id }),
    );
  }

  linesOnDownExcel(data: ProjectLine[]) {
    const fs = this.formatService;
    return forkJoin(
      data.map(a => {
        const nD: any = { ...a };
        nD.START_DATE = fs.date(a.START_DATE, 'YYYY-MM-DD');
        nD.DUE_DATE = fs.date(a.DUE_DATE, 'YYYY-MM-DD');
        const { ASSIGNEE_LIST: aList } = a;
        const formatAssigner = this.formatService
          .empno(a.ASSIGNER, 'CH(EN)')
          .pipe(
            map(r => {
              nD.ASSIGNER = r;
              return a;
            }),
          );
        if (aList.length) {
          return forkJoin([
            forkJoin(
              aList.map(_ => this.formatService.empno(_, 'CH(EN)')),
            ).pipe(
              map(res => {
                nD.ASSIGNEE_LIST = res.join(' ; ');
              }),
            ),
            formatAssigner,
          ]).pipe(map(() => nD));
        } else {
          return formatAssigner.pipe(map(() => nD));
        }
      }),
    );
  }
}
