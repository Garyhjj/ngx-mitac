import { GeckoRepairComponent } from './gecko-repair/gecko-repair.component';
import { GeckoRmaComponent } from './gecko-rma/gecko-rma.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeckoShippingComponent } from './gecko-shipping/gecko-shipping.component';
import { ReportComponent } from '../report.component';
import { AuthGuard } from '../../../route/auth-guard.service';
import { GeckoReportComponent } from './gecko-report.component';



const eRoutes: Routes = [
    {
        path: '',
        component: GeckoReportComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'geckoShipping',
                component: GeckoShippingComponent
            },
            {
                path: 'geckoRma',
                component: GeckoRmaComponent
            },
            {
                path: 'geckoRepair',
                component: GeckoRepairComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(eRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class GeckoReportRoutingModule { }
