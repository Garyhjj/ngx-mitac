import { MyProjectsTaskComponent } from './my-projects-task/my-projects-task.component';
import { ProjectTaskComponent } from './project-task/project-task.component';
import { ProjectMaintenanceComponent } from './project-maintenance/project-maintenance.component';
import { AuthGuard } from './../../route/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectScanComponent } from './project-scan/project-scan.component';
import { ProjectNetComponent } from './project-net/project-net.component';
import { ProjectTasksAnalysisComponent } from './project-tasks-analysis/project-tasks-analysis.component';

const bRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'basic',
        loadChildren: './basic/project-basic.module#ProjectBasicModule',
      },
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
      {
        path: 'scan',
        component: ProjectScanComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: 'net',
        component: ProjectNetComponent,
      },
      {
        path: 'mtask',
        component: MyProjectsTaskComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: 'analysis',
        component: ProjectTasksAnalysisComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bRoutes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
