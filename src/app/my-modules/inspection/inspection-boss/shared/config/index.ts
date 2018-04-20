import { APPConfig } from './../../../../../shared/config/app.config';

export const inspectionBossConfig = {

    getEmployeeSchedule: APPConfig.baseUrl + 'IPQA/GetEmployeeSchedule?company={company}',
    uploadSchedule: APPConfig.baseUrl + 'IPQA/UploadSchedule',
    deleteScheduleLines: APPConfig.baseUrl + 'IPQA/DeleteScheduleLines?sechedule_line_id={sechedule_line_id}',
    getMriWeek: APPConfig.baseUrl + 'IPQA/GetMRIWeek?bweek=1&eweek=8',
    getReport: APPConfig.baseUrl + 'IPQA/GetReport?header_id={header_id}',
    uploadReport: APPConfig.baseUrl + 'IPQA/UploadReport'
};

