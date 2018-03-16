import { AuthGuard } from './../../route/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationComponent } from './reservation.component';



const bRoutes: Routes = [
    {
        path: '',
        component: ReservationComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'basic',
                loadChildren: './basic/basic.module#BasicModule'
            },
            {
                path: 'IT',
                loadChildren: './reservation-IT/reservation-IT.module#ReservationITModule'
            },
            // {
            //     path: 'equip',
            //     loadChildren: 'app/my-modules/inspection/inspection-equip/inspection-equip.module#InspectionEquipModule'
            // }
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
export class ReservationRoutingModule { }
