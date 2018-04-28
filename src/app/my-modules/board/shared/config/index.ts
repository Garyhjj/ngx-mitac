import { APPConfig } from './../../../../shared/config/app.config';

export const boardConfig = {
  getEsdQuantity: APPConfig.baseUrl + 'ESD/GetQuantity?flag={flag}',

  getTopDep: APPConfig.baseUrl + 'ESD/GetBuDeptno',

  getSubDep: APPConfig.baseUrl + 'ESD/GetChuDeptno?bu_deptno={bu_deptno}',

  getEsdNotPassList:
    APPConfig.baseUrl + 'ESD/GetNotThrough?chu_deptno={chu_deptno}',
};
