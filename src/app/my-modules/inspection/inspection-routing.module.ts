import { AuthGuard } from './../../route/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionComponent } from './inspection.component';



const bRoutes: Routes = [
    {
        path: '',
        component: InspectionComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'basic',
                loadChildren: 'app/my-modules/inspection/inspection-basic/inspection-basic.module#InspectionBasicModule'
            },
            {
                path: 'boss',
                loadChildren: 'app/my-modules/inspection/inspection-boss/inspection-boss.module#InspectionBossModule'
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
export class InspectionRoutingModule { }
