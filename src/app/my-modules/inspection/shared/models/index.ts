export interface InspectionReportState {
    Header: InspectionReportHeader;
    Lines: InspectionReportLineState[];
}

export interface InspectionReportHeader {
    HEADER_ID: number;
    SCHEDULE_HEADER_ID: number;
    COMPANY_NAME: string;
    INSPECTOR?: string;
    INSPECT_DATE: string;
    SCORE?: number;
    ADDITIONAL_SCORE?: number;
    TYPE: string;
    INSPECTOR_NAME: string;
    MACHINE_ID?: string;
    MACHINE_NAME?: string;
}

export interface InspectionReportLineState {
    HEADER_ID?: number;
    INSPECT_DATE?: string;
    INSPECT_TIME?: string;
    LOCATION?: string;
    LINE_ID?: string;
    PROBLEM_FLAG?: 'Y' | 'N' | '';
    PROBLEM_DESC?: string;
    PROBLEM_PICTURES?: string;
    PROBLEM_STATUS?: 'New' | 'Waiting' | 'Done' | 'Close' | 'Highlight' | 'WaitingBoss' | 'WaitingQA';
    OWNER_EMPNO?: string;
    BOSS_EMPNO?: string;
    QA_EMPNO?: string;
    CLOSER_EMPNO?: string;
    CLOSER_DESC?: string;
    CLOSE_DATE?: string;
    SCORE?: number;
    COMPANY_NAME?: string;
    ACTION_DATE?: string;
    ACTION_DESC?: string;
    ACTION_PICTURES?: string;
    ACTION_STATUS?: string;
    CHECK_ID?: string;
    CHECK_LIST_CN?: string;
    CHECK_LIST_EN?: string;
    MACHINE_ID?: string;
    MACHINE_NAME?: string;
    INSPECTOR?: string;
    DUTY_KIND?: string;
    NUM?: string;
    CORRECTDESC?: string;
    RELATION_PRODUCT?: string;
    PROBLEM_TYPE?: string;
    DUTY_DEPT?: string;
}
