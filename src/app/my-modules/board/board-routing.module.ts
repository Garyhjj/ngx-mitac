import { OspComponent } from './osp/osp.component';
import { UrgentNoComponent } from './urgent-no/urgent-no.component';
import { BoardComponent } from './board.component';
import { AuthGuard } from './../../route/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrgentMaterialComponent } from './urgent-material/urgent-material.component';
import { EsdComponent } from './esd/esd.component';

const bRoutes: Routes = [
  {
    path: '',
    component: BoardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'urgentMaterial',
        component: UrgentMaterialComponent,
      },
      {
        path: 'urgentNo',
        component: UrgentNoComponent,
      },
      {
        path: 'esd',
        component: EsdComponent,
      },
      {
        path: 'osp',
        component: OspComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bRoutes)],
  exports: [RouterModule],
})
export class BoardRoutingModule {}
