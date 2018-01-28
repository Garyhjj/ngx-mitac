import { CheckboxQuestionComponent } from './../../inputs/checkbox-question/checkbox-question.component';
import { RadioQuestionComponent } from './../../inputs/radio-question/radio-question.component';
import { SharedModule } from './../../../shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamComponent } from './exam.component';
import { TrueOrFalseComponent } from '../../inputs/true-or-false/true-or-false.component';

@NgModule({
  imports: [
    CommonModule, SharedModule
  ],
  declarations: [ExamComponent, TrueOrFalseComponent, RadioQuestionComponent, CheckboxQuestionComponent],
  exports: [ExamComponent]
})
export class ExamModule { }