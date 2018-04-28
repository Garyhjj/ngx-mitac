import { InjectionToken } from '@angular/core';

export const EXAM_CONFIG = new InjectionToken<{
  UpdateMapping: string;
  getExamPaper: string;
  getExamHeader: string;
  updateExamResult: string;
  updateExamAnswer: string;
}>('examConfig');
