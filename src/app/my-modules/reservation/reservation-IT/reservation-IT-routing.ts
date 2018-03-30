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
                component: ApplicationITComponent
            },
            {
                path: 'self',
                component: SelfApplicationITComponent
            },
            {
                path: 'workspace',
                component: ITServerWorkspaceComponent
            },
            {
                path: 'track',
                component: ITServerTrackComponent
            },
            {
                path: 'rate',
                component: ITServerRateComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(bRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ReservationITRoutingModule { }
