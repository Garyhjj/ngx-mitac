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

@NgModule({
  imports: [CommonModule, ProjectRoutingModule, SharedModule, DataDriveModule],
  declarations: [
    ProjectComponent,
    ProjectMaintenanceComponent,
    ProjectTaskComponent,
    TaskDetailComponent,
    ProjectDetailComponent,
  ],
  entryComponents: [TaskDetailComponent, ProjectDetailComponent],
  providers: [ProjectService],
})
export class ProjectModule {}
