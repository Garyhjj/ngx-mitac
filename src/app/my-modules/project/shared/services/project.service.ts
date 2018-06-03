import { projectConfig } from './../config/index';
import { HttpClient } from '@angular/common/http';
import { isArray, replaceQuery } from './../../../../shared/utils/index';
import { Injectable } from '@angular/core';

@Injectable()
export class ProjectService {
  constructor(private http: HttpClient) {}

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

  getProjectHistory(HEADER_ID) {
    return this.http.get(
      replaceQuery(projectConfig.getProjectHistory, { HEADER_ID }),
    );
  }
}
