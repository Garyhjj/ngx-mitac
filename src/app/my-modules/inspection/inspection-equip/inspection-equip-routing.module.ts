import { InspectionEquipCheckListComponent } from './inspection-equip-checkList/inspection-equip-checkList.component';
import { InspectionEquipListComponent } from './inspection-equip-list/inspection-equip-list.component';
import { InspectionEquipLinesComponent } from './inspection-equip-lines/inspection-equip-lines.component';
import { InspectionEquipImprovementComponent } from './inspection-equip-improvement/inspection-equip-improvement.component';
import { InspectionEquipComponent } from './inspection-equip.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../route/auth-guard.service';



const eRoutes: Routes = [
    {
        path: '',
        component: InspectionEquipComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'lines',
                component: InspectionEquipLinesComponent
            },
            // {
            //     path: 'report',
            //     component: InspectionBossReportComponent,
            //     resolve: {
            //         schedule: BossScheduleResolver
            //     }
            // },
            {
                path: 'improvement',
                component: InspectionEquipImprovementComponent
            },
            {
                path: 'list',
                component: InspectionEquipListComponent
            },
            // {
            //     canActivate: [BossGuard],
            //     path: 'schedule',
            //     component: InspectionBossScheduleComponent
            // },
            {
                path: 'checkList',
                component: InspectionEquipCheckListComponent
            }
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(eRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: []
})
export class InspectionEquipRoutingModule { }
