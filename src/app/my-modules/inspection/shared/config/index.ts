import { APPConfig } from './../../../../shared/config/app.config';
export const inspectionConfig = {
    uploadReport: APPConfig.baseUrl + 'IPQA/UploadReport',
    getMRIName: APPConfig.baseUrl + 'IPQA/GetMRIName?company_name={*COMPANY_ID}&type={type}'
};
