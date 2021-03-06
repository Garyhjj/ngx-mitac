import { ITServerWholeComponent } from './IT-server-Whole/IT-server-Whole.component';
import { ITServerAddComponent } from './IT-server-add/IT-server-add.component';
import { ITServerBoardComponent } from './IT-server-board/IT-server-board.component';
import { ReservationGuard } from './../reservation-guard.service';
import { ITServerRateComponent } from './IT-server-rate/IT-server-rate.component';
import { ITServerTrackComponent } from './IT-server-track/IT-server-track.component';
import { ITServerWorkspaceComponent } from './IT-server-workspace/IT-server-workspace.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../route/auth-guard.service';
import { ReservationITComponent } from './reservation-IT.component';
import { ApplicationITComponent } from './application-IT/application-IT.component';
import { SelfApplicationITComponent } from './self-application-IT/self-application-IT.component';

const bRoutes: Routes = [
  {
    path: '',
    component: ReservationITComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'application',
        component: ApplicationITComponent,
      },
      {
        path: 'self',
        component: SelfApplicationITComponent,
      },
      {
        canActivateChild: [ReservationGuard],
        path: 'workspace',
        component: ITServerWorkspaceComponent,
      },
      {
        canActivateChild: [ReservationGuard],
        path: 'track',
        component: ITServerTrackComponent,
      },
      {
        canActivateChild: [ReservationGuard],
        path: 'rate',
        component: ITServerRateComponent,
      },
      {
        canActivateChild: [ReservationGuard],
        path: 'board',
        component: ITServerBoardComponent,
      },
      {
        canActivateChild: [ReservationGuard],
        path: 'add',
        component: ITServerAddComponent,
      },
      {
        canActivateChild: [ReservationGuard],
        path: 'whole',
        component: ITServerWholeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bRoutes)],
  exports: [RouterModule],
})
export class ReservationITRoutingModule {}
