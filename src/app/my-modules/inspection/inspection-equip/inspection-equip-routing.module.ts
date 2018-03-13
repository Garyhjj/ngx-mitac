import { EquipGuard } from './equip-guard.service';
import { InspectionEquipHistoryComponent } from './inspection-equip-history/inspection-equip-history.component';
import { InspectionEquipStatusComponent } from './inspection-equip-status/inspection-equip-status.component';
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
                canActivate: [EquipGuard],
                path: 'lines',
                component: InspectionEquipLinesComponent
            },
            {
                canActivate: [EquipGuard],
                path: 'history',
                component: InspectionEquipHistoryComponent
            },
            {
                path: 'improvement',
                component: InspectionEquipImprovementComponent
            },
            {
                canActivate: [EquipGuard],
                path: 'list',
                component: InspectionEquipListComponent
            },
            {
                canActivate: [EquipGuard],
                path: 'status',
                component: InspectionEquipStatusComponent
            },
            {
                canActivate: [EquipGuard],
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
