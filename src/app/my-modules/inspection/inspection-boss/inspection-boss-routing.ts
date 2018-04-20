import { BossGuard } from './boss-guard.service';
import { InspectionBossCommentComponent } from './inspection-boss-comment/inspection-boss-comment.component';
import { InspectionBossScheduleComponent } from './inspection-boss-schedule/inspection-boss-schedule.component';
import { InspectionBossAttendanceComponent } from './inspection-boss-attendance/inspection-boss-attendance.component';
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
                canActivate: [BossGuard],
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
            },
            {
                canActivate: [BossGuard],
                path: 'attendance',
                component: InspectionBossAttendanceComponent
            },
            {
                canActivate: [BossGuard],
                path: 'schedule',
                component: InspectionBossScheduleComponent
            },
            {
                canActivate: [BossGuard],
                path: 'comment',
                component: InspectionBossCommentComponent
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
    ],
    providers: [BossScheduleResolver]
})
export class InspectionBossRoutingModule { }
