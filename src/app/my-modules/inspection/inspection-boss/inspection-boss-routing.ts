import { InspectionBossImprovementComponent } from './inspection-boss-improvement/inspection-boss-improvement.component';
import { BossScheduleResolver } from './boss-schedule-resolver.service';
import { InspectionBossReportComponent } from './inspection-boss-report/inspection-boss-report.component';
import { InspectionBossLinesComponent } from './inspection-boss-lines/inspection-boss-lines.component';
import { InspectionBossComponent } from './inspection-boss.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../route/auth-guard.service';



const bRoutes: Routes = [
    {
        path: '',
        component: InspectionBossComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'lines',
                component: InspectionBossLinesComponent
            },
            {
                path: 'report',
                component: InspectionBossReportComponent,
                resolve: {
                    schedule: BossScheduleResolver
                }
            },
            {
                path: 'improvement',
                component: InspectionBossImprovementComponent
            }
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(bRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [BossScheduleResolver]
})
export class InspectionBossRoutingModule { }
