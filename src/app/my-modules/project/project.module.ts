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
  ],
})
export class ProjectModule {}
