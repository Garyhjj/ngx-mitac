import { ExamService } from './shared/services/exam.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class ExamGuard implements CanActivate {
  constructor(private examService: ExamService) {}
  canActivate() {
    const role = this.examService.role;
    return role === 1 || role === 2;
  }
}
