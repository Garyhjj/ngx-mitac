import { ExamService } from './shared/services/exam.service';
import { DataDriveModule } from './../../shared/components/data-drive/data-drive.module';
import { ExamRoutingModule } from './exam-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamComponent } from './exam.component';
import { ExamQuestionComponent } from './exam-question/exam-question.component';
import { ExamUnitComponent } from './exam-unit/exam-unit.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, ExamRoutingModule, DataDriveModule
  ],
  declarations: [
    ExamComponent,
    ExamQuestionComponent,
    ExamUnitComponent
  ],
  providers: [ExamService]
})
export class ExamModule { }