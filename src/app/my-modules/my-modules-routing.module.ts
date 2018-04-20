import { AuthGuard } from './../route/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyModulesComponent } from './my-modules.component';

const mRoutes: Routes = [
    {
        path: '',
        component: MyModulesComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'eMPI',
                loadChildren: 'app/my-modules/eMPI/eMPI.module#EMPIModule'
            },
            {
                path: 'board',
                loadChildren: 'app/my-modules/board/board.module#BoardModule'
            },
            {
                path: 'exam',
                loadChildren: 'app/my-modules/exam/exam.module#ExamModule'
            },
            {
                path: 'inspection',
                loadChildren: 'app/my-modules/inspection/inspection.module#InspectionModule'
            },
            {
                path: 'reservation',
                loadChildren: './reservation/reservation.module#ReservationModule'
            },
            {
                path: 'report',
                loadChildren: 'app/my-modules/report/report.module#ReportModule'
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(mRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class MyModulesRoutingModule { }
