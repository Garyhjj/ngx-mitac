import { OspComponent } from './osp/osp.component';
import { UrgentNoComponent } from './urgent-no/urgent-no.component';
import { BoardComponent } from './board.component';
import { AuthGuard } from './../../route/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrgentMaterialComponent } from './urgent-material/urgent-material.component';
import { EsdComponent } from './esd/esd.component';
import { ShippingComponent } from './shipping/shipping.component';
import { CvteComponent } from './cvte/cvte.component';

const bRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'urgentMaterial',
        component: UrgentMaterialComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: 'urgentNo',
        component: UrgentNoComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: 'shipping',
        component: ShippingComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: 'cvte',
        component: CvteComponent,
        data: {
          reuse: false,
        },
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
