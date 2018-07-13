import { DataDriveService } from './../../../shared/components/data-drive/core/services/data-drive.service';
import { TaskTabsetComponent } from './../shared/components/task-tabset/task-tabset.component';
import { DataDrive } from './../../../shared/components/data-drive/shared/models/index';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-my-projects-task',
  templateUrl: './my-projects-task.component.html',
  styleUrls: ['./my-projects-task.component.css'],
})
export class MyProjectsTaskComponent implements OnInit {
  taskList$ = new Subject();
  constructor(
    private auth: AuthService,
    private dataDriveService: DataDriveService,
  ) {}

  ngOnInit() {}

  getDataDrive(d: DataDrive) {
    d.tableData.searchable = true;
    d.addDefaultSearchParams({ owner: this.auth.user.EMPNO });
    d.additionalFn = d.additionalFn;
    d.additionalFn.menu = false;
    d.afterDataInit(data => this.taskList$.next(data));
    const viewer = d.viewerRegister(TaskTabsetComponent, {
      tasksObserver: this.taskList$,
      afterDataChange: () => {
        this.dataDriveService.updateViewData(d);
      },
    });
    setTimeout(() => {
      d.switchViewType(viewer.type);
    }, 50);
  }

  showAttachmentDetail(files) {
    console.log(files);
  }
}
