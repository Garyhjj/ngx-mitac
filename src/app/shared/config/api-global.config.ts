import { APPConfig } from "./app.config";

export const APIGlobalConfig = {
    getAgentUrl: APPConfig.baseUrl + 'OffDuty/GetOffDutyAgent?emp_name={emp_name}',
    /**
     * URL
     * 上传图片，获得返回的url
     * post { "PICTURE":"Base64 String..." }
     * 2017-09-30
     * @static
     */
    uploadPicture: APPConfig.baseUrl + 'IPQA/UploadPicture'
}