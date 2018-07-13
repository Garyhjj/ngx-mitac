import { ProjectBasicComponent } from './project-basic.component';
import { TaskBuComponent } from './task-bu/task-bu.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../route/auth-guard.service';
import { TaskCustomerComponent } from './task-customer/task-customer.component';
import { ProjectTypeComponent } from './project-type/project-type.component';

const bRoutes: Routes = [
  {
    path: '',
    component: ProjectBasicComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'type',
        component: ProjectTypeComponent,
      },
      {
        path: 'customer',
        component: TaskCustomerComponent,
      },
      {
        path: 'bu',
        component: TaskBuComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bRoutes)],
  exports: [RouterModule],
})
export class ProjectBasicRoutingModule {}
