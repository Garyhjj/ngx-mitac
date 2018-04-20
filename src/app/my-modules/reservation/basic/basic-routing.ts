import { ReservationTypeComponent } from './reservation-type/reservation-type.component';
import { ApplicationImpressionComponent } from './application-impression/application-impression.component';
import { ReservationPersonComponent } from './reservation-person/reservation-person.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../route/auth-guard.service';
import { BasicComponent } from './basic.component';
import { ReservationDepartmentComponent } from './reservation-department/reservation-department.component';
import { ResvationTimeComponent } from './resvation-time/resvation-time.component';



const bRoutes: Routes = [
    {
        path: '',
        component: BasicComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'department',
                component: ReservationDepartmentComponent
            },
            {
                path: 'person',
                component: ReservationPersonComponent
            },
            {
                path: 'time',
                component: ResvationTimeComponent
            },
            {
                path: 'impression',
                component: ApplicationImpressionComponent
            },
            {
                path: 'type',
                component: ReservationTypeComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(bRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class BasicRoutingModule { }
