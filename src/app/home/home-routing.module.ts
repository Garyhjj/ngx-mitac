import { AuthGuard } from './../route/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';

const homeRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'eMPI',
                loadChildren: 'app/my-modules/eMPI/eMPI.module#EMPIModule'
            },
            {
                path: 'board',
                loadChildren: 'app/my-modules/board/board.module#BoardModule'
            },
            {
                path: 'exam',
                loadChildren: 'app/my-modules/exam/exam.module#ExamModule'
            },
            {
                path: 'inspection',
                loadChildren: 'app/my-modules/inspection/inspection.module#InspectionModule'
            }
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(homeRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class HomeRoutingModule { }
