import { TaskTabsetComponent } from './shared/components/task-tabset/task-tabset.component';
import { ProjectTreeComponent } from './shared/components/project-tree/project-tree.component';
import { ProjectService } from './shared/services/project.service';
import { ProjectDetailComponent } from './shared/components/project-detail/project-detail.component';
import { TaskDetailComponent } from './shared/components/task-detail/task-detail.component';
import { ProjectRoutingModule } from './project-routing.module';
import { DataDriveModule } from './../../shared/components/data-drive/data-drive.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import { SharedModule } from '../../shared/shared.module';
import { ProjectMaintenanceComponent } from './project-maintenance/project-maintenance.component';
import { ProjectTaskComponent } from './project-task/project-task.component';
import { ProjectScanComponent } from './project-scan/project-scan.component';
import { ProjectNetComponent } from './project-net/project-net.component';
import { MyProjectsTaskComponent } from './my-projects-task/my-projects-task.component';
import { ProjectTasksAnalysisComponent } from './project-tasks-analysis/project-tasks-analysis.component';

@NgModule({
  imports: [CommonModule, ProjectRoutingModule, SharedModule, DataDriveModule],
  declarations: [
    ProjectComponent,
    ProjectMaintenanceComponent,
    ProjectTaskComponent,
    TaskDetailComponent,
    ProjectDetailComponent,
    ProjectScanComponent,
    ProjectTreeComponent,
    ProjectNetComponent,
    MyProjectsTaskComponent,
    ProjectTasksAnalysisComponent,
    TaskTabsetComponent,
  ],
  entryComponents: [
    TaskDetailComponent,
    ProjectDetailComponent,
    ProjectTreeComponent,
    TaskTabsetComponent,
  ],
  providers: [ProjectService],
})
export class ProjectModule {}
