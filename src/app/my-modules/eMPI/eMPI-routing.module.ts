import { EMPIComponent } from './eMPI.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const eRoutes: Routes = [
    {
        path: '',
        component:EMPIComponent,
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
