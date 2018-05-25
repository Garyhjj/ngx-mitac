import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../shared/components/data-drive/shared/models';
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
  selector: 'app-project-task',
  templateUrl: './project-task.component.html',
  styleUrls: ['./project-task.component.css'],
})
export class ProjectTaskComponent implements OnInit {
  comments = [
    {
      USER_NAME: 'FE716',
      CONTENT: '提供的资料需要加上XXX',
      CREATION_DATE: new Date().getTime(),
    },
    {
      USER_NAME: 'FE717',
      CONTENT: '某某资料可以去找XX去拿',
      CREATION_DATE: 1527233804626,
    },
  ];
  constructor() {}

  ngOnInit() {}

  getDataDrive1(d: DataDrive) {
    setTimeout(_ => {
      d.selfUpdateTableData(task);
    });
  }
}
