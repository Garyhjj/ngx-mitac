import { AuthGuard } from './../../route/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report.component';



const bRoutes: Routes = [
    {
        path: '',
        component: ReportComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'geckoReport',
                loadChildren: 'app/my-modules/report/gecko-report/gecko-report.module#GeckoReportModule'
            },
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

export class ReportRoutingModule { }



