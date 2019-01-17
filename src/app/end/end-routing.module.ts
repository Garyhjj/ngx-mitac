import { EndComponent } from './end.component';
import { AuthGuard } from './../route/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const eRoutes: Routes = [
  {
    path: '',
    component: EndComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dataDrive',
        data: {
          noAuthority: true,
        },
        loadChildren:
          'app/end/data-drive-setting/data-drive-setting.module#DataDriveSettingModule',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eRoutes)],
  exports: [RouterModule],
})
export class EndRoutingModule {}
