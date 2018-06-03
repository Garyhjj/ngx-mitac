import { ProjectTaskComponent } from './project-task/project-task.component';
import { ProjectMaintenanceComponent } from './project-maintenance/project-maintenance.component';
import { AuthGuard } from './../../route/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project.component';

const bRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'main',
        component: ProjectMaintenanceComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: 'task',
        component: ProjectTaskComponent,
        data: {
          reuse: false,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bRoutes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
