import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard }                from './auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'modules',
  pathMatch: 'full'},
  { path: 'modules', loadChildren: 'app/my-modules/my-modules.module#MyModulesModule'},
  { path: 'login', loadChildren: 'app/login/login.module#LoginModule'},
  { path: '**', redirectTo: '',
  pathMatch: 'full'},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
