import { DriveEditComponent } from './drive-edit/drive-edit.component';
import { DriveListComponent } from './drive-list/drive-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../route/auth-guard.service';
import { DataDriveSettingComponent } from './data-drive-setting.component';



const dRoutes: Routes = [
    {
        path: '',
        component: DataDriveSettingComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'list',
                component: DriveListComponent
            },
            {
                path: 'edit',
                component: DriveEditComponent
            },
            {
                path: 'edit/:id',
                component: DriveEditComponent
            }
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(dRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: []
})
export class DataDriveSettingRoutingModule { }
