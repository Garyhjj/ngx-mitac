import { AuthGuard } from './../../route/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamComponent } from './exam.component';
import { ExamQuestionComponent } from './exam-question/exam-question.component';
import { ExamUnitComponent } from './exam-unit/exam-unit.component';


const bRoutes: Routes = [
    {
        path: '',
        component: ExamComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'question',
                component: ExamQuestionComponent
            },
            {
                path: 'unit',
                component: ExamUnitComponent
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
export class ExamRoutingModule { }
