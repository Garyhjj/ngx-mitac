import { TaxComponent } from './tax.component';
import { AuthGuard } from './../../route/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxReportComponent } from './tax-report/tax-report.component';

const bRoutes: Routes = [
  {
    path: '',
    component: TaxComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'report',
        component: TaxReportComponent,
      },
      // {
      //   path: 'IT',
      //   loadChildren:
      //     './reservation-IT/reservation-IT.module#ReservationITModule',
      // },
      // {
      //     path: 'equip',
      //     loadChildren: 'app/my-modules/inspection/inspection-equip/inspection-equip.module#InspectionEquipModule'
      // }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bRoutes)],
  exports: [RouterModule],
})
export class TaxRoutingModule {}
