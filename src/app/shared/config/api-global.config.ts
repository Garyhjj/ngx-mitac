import { APPConfig } from './app.config';

export const APIGlobalConfig = {
  getAgentUrl: APPConfig.baseUrl + 'Guid/GetUserLikeNoSite?emp_name={emp_name}',
  /**
   * URL
   * 上传图片，获得返回的url
   * post { "PICTURE":"Base64 String..." }
   * 2017-09-30
   * @static
   */
  uploadPicture: APPConfig.baseUrl + 'IPQA/UploadPicture',

  getSelfPrivilege:
    APPConfig.baseUrl + 'Guid/GetUserFunctions?moduleID={moduleID}',

  getAllTips: APPConfig.baseUrl + 'users/tips',
  uploadError: APPConfig.baseUrl + 'utils/logs',
};
