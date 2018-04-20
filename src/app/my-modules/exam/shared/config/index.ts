import { APPConfig } from './../../../../shared/config/app.config';
export const examConfig = {
    /*
    更新考卷及問題的關係表
    post
    2018/2/2
    */
    UpdateMapping: APPConfig.baseUrl + 'EXAM/UpdateMapping',

    getExamPaper: APPConfig.baseUrl + 'EXAM/GetExamMappings?exam_id={exam_id}&company_id={company_id}',

    getExamHeader: APPConfig.baseUrl + 'EXAM/GetExams?id={id}&title={title}&ref_dept={ref_dept}&code={code}&version={version}&company_id={company_id}',

    updateExamResult: APPConfig.baseUrl + 'EXAM/UpdateResult',

    updateExamAnswer: APPConfig.baseUrl + 'EXAM/UpdateAnswer'
};

export interface ExamMapping {
    ID: number;
    EXAM_ID: number;
    QUESTION_ID: number;
    NUM: number;
    SCORE: number;
    COMPANY_ID: string;
}
