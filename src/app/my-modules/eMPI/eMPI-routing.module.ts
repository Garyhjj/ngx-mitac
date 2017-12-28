import { AuthGuard } from './../../route/auth-guard.service';
import { ScanComponent } from './scan/scan.component';
import { EMPIComponent } from './eMPI.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const eRoutes: Routes = [
    {
        path: '',
        component:EMPIComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children:[{
            path:'scan',
            component: ScanComponent
        }]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(eRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class EMPIRoutingModule { }
