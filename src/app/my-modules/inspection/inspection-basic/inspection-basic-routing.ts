import { InspectionNameComponent } from './inspection-name/inspection-name.component';
import { InspectionBasicComponent } from './inspection-basic.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../route/auth-guard.service';



const bRoutes: Routes = [
    {
        path: '',
        component: InspectionBasicComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'name',
                component: InspectionNameComponent
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
export class InspectionBasicRoutingModule { }
