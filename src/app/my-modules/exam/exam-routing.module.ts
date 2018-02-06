import { ExamGuard } from './exam-guard.service';
import { AuthGuard } from './../../route/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamComponent } from './exam.component';
import { ExamQuestionComponent } from './exam-question/exam-question.component';
import { ExamUnitComponent } from './exam-unit/exam-unit.component';
import { DoExamComponent } from './do-exam/do-exam.component';


const bRoutes: Routes = [
    {
        path: '',
        component: ExamComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                canActivate: [ExamGuard],
                path: 'question',
                component: ExamQuestionComponent
            },
            {
                canActivate: [ExamGuard],
                path: 'unit',
                component: ExamUnitComponent
            },
            {
                path: 'do/:id',
                component: DoExamComponent
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
