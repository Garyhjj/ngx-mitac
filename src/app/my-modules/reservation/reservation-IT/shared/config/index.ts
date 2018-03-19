import { APPConfig } from './../../../../../shared/config/app.config';
export const reservationITConfig =  {
    /**
     * URL
     * 获取服务部门在某時間段內的剩餘號數
     * GET
     * 2018-03-19
     * @param {number} {dept_id}
     */
    getServiceDateMes: APPConfig.baseUrl + 'Service/GetServiceResidual?dept_id={dept_id}',

    /**
     * URL
     * 获取服务部门在某天內分段的剩餘號數
     * GET
     * 2018-03-19
     * @param {number} {dept_id}
     * @param {string} {date} // YYYY-MM-DD
     */
    getServiceDayInfo: APPConfig.baseUrl + 'Service/GetServiceInfo?dept_id={dept_id}&date={date}'
}