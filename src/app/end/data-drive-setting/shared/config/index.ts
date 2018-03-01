import { APPConfig } from './../../../../shared/config/app.config';
export const DataDriveSettingConfig = {
    uploadSetting: APPConfig.baseUrl + 'SystemOperation/UpdateDataDrive',
    deleteSetting: APPConfig.baseUrl + 'SystemOperation/DeleteDataDrive?id={id}',
    getSetting: APPConfig.baseUrl + 'SystemOperation/GetDataDrives?id={id}&description={description}'
}