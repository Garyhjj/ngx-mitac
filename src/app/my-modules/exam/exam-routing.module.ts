import { AuthGuard } from './../../route/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamComponent } from './exam.component';


const bRoutes: Routes = [
    {
        path: '',
        component: ExamComponent,
        canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        // children: [
        //     {
        //         path: 'urgentMaterial',
        //         component: UrgentMaterialComponent
        //     },
        //     {
        //         path: 'urgentNo',
        //         component: UrgentNoComponent
        //     }
        // ]
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
export class ExamRoutingModule { }
