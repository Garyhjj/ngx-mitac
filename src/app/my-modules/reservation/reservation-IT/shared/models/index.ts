export interface ServiceTimeInfo {
    DEPT_ID: number;
    DEPT_NAME: string;
    END_TIME: string;
    MAX_COUNT: number;
    PRE_MIN_MINUTE: number;
    REMAIN_NUMBER: number;
    START_TIME: string;
    TIME_ID: number;
}


export interface ReservationApplication {
    ID?: number;
    DOCNO?: string;
    STATUS?: string;
    DEPT_ID?: number;
    SERVICE_DATE?: string;
    SERVICE_DESC?: string;
    IMAGES?: string;
    CONTACT?: string;
    MOBILE?: string;
    HANDLER?: string;
    TYPE?: string;
    REMARK?: string;
    HANDLE_TIME?: number;
    HANDLE_TIME_UNIT?: string;
    RESET_FLAG?: string;
    MANUAL_FLAG?: string;
    COMPANY_ID?: string;
    TIME_ID?: number;
    SCORE?: number;
    PROCESS_TIME?: string;
    START_TIME?: string;
    END_TIME?: string;
    images?: string[];
    actionType?: number;
}
