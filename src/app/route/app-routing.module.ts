import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'modules',
    pathMatch: 'full',
  },
  {
    path: 'modules',
    canActivate: [AuthGuard],
    loadChildren: 'app/my-modules/my-modules.module#MyModulesModule',
  },
  { path: 'login', loadChildren: 'app/login/login.module#LoginModule' },
  {
    path: 'end',
    canActivate: [AuthGuard],
    loadChildren: 'app/end/end.module#EndModule',
  },
  {
    path: '**',
    redirectTo: 'modules',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
