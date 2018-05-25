import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../shared/components/data-drive/shared/models';
import { AuthService } from '../../../core/services/auth.service';

const people = [
  {
    PERSON: 'FE716',
  },
  {
    PERSON: 'FE717',
  },
];
const task = [
  {
    ASSIGNEE: 'FX823',
    ASSIGNER: 'FX823',
    BU: 'TBU',
    CUSTOMER: 'Inter',
    DESCRIPTION: '提供XX文件',
    DUE_DATE: '2018-05-26',
    ID: 0,
    IMPACT: '$300',
    MODEL: 'M701',
    START_DATE: '2018-05-16',
    TYPE: '12',
  },
];
@Component({
  selector: 'app-project-maintenance',
  templateUrl: './project-maintenance.component.html',
  styleUrls: ['./project-maintenance.component.css'],
})
export class ProjectMaintenanceComponent implements OnInit {
  history = [
    {
      USER_NAME: 'FX823',
      CONTENT: '创建项目',
      CREATION_DATE: 1527233804626,
    },
  ];
  empno = this.auth.user.EMPNO;
  constructor(private auth: AuthService) {}

  ngOnInit() {}

  getDataDrive1(d: DataDrive) {
    d.tableData.addable = true;
    d.tableData.editable = true;
    setTimeout(_ => {
      d.selfUpdateTableData([
        {
          ID: 1,
          NAME: 'moa1',
          START_DATE: '2018-05-01',
          DUE_DATE: '2018-06-01',
          OWNER: 'FX823',
          TYPE: '客诉',
          DESCRIPTION: '解决XXXX问题',
        },
      ]);
    }, 0);
  }

  getDataDrivePeople(d: DataDrive) {
    setTimeout(() => {
      d.selfUpdateTableData(people);
      d.changeUpdateWay(data => {
        people.push(data);
        this.history.unshift({
          USER_NAME: this.empno,
          CONTENT: '增加组员' + data.PERSON,
          CREATION_DATE: new Date().getTime(),
        });
        this.history = this.history.slice();
        setTimeout(_ => {
          d.selfUpdateTableData(people);
        });
        return Observable.of(1);
      });
    });
  }

  getDataDriveSub(d: DataDrive) {
    d.tableData.addable = true;
    d.tableData.editable = true;
    setTimeout(_ => {
      d.selfUpdateTableData(task);
    });
    d.changeUpdateWay(data => {
      data.ASSIGNER = this.empno;
      task.push(data);
      this.history.unshift({
        USER_NAME: this.empno,
        CONTENT: `增加任务:  ${data.DESCRIPTION}, 负责人: ${
          data.ASSIGNEE
        }, 项目ID: ${data.ID}`,
        CREATION_DATE: new Date().getTime(),
      });
      this.history = this.history.slice();
      setTimeout(_ => {
        d.selfUpdateTableData(task);
      });
      return Observable.of(1);
    });
  }
}
