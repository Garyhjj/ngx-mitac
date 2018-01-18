import { BoardComponent } from './board.component';
import { AuthGuard } from './../../route/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrgentMaterialComponent } from './urgent-material/urgent-material.component';


const bRoutes: Routes = [
    {
        path: '',
        component:BoardComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children:[{
            path:'urgentMaterial',
            component: UrgentMaterialComponent
        }]
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
export class BoardRoutingModule { }
