import { APPConfig } from './../../../../shared/config/app.config';
export const examConfig = {
    /*
    更新考卷及問題的關係表
    post
    2018/2/2
    */
    UpdateMapping: APPConfig.baseUrl + 'EXAM/UpdateMapping',
}

export interface ExamMapping {
    ID: number;
    EXAM_ID: number;
    QUESTION_ID: number;
    NUM: number;
    SCORE: number;
    COMPANY_ID: string;
}