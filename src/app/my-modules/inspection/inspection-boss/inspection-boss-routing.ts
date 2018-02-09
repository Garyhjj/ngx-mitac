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
    ]
})
export class InspectionBossRoutingModule { }
