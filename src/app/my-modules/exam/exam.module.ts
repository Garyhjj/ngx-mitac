import { ExamPaperModule } from './../../shared/components/data-drive/data-viewer/exam-paper/exam-paper.module';
import { ExamGuard } from './exam-guard.service';
import { ExamService } from './shared/services/exam.service';
import { DataDriveModule } from './../../shared/components/data-drive/data-drive.module';
import { ExamRoutingModule } from './exam-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamComponent } from './exam.component';
import { ExamQuestionComponent } from './exam-question/exam-question.component';
import { ExamUnitComponent } from './exam-unit/exam-unit.component';
import { DoExamComponent } from './do-exam/do-exam.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, ExamRoutingModule, DataDriveModule, ExamPaperModule
  ],
  declarations: [
    ExamComponent,
    ExamQuestionComponent,
    ExamUnitComponent,
    DoExamComponent
],
  providers: [ExamService, ExamGuard]
})
export class ExamModule { }