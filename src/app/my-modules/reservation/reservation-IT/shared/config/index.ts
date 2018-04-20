import { APPConfig } from './../../../../../shared/config/app.config';
export const reservationITConfig = {
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
    getServiceDayInfo: APPConfig.baseUrl + 'Service/GetServiceInfo?dept_id={dept_id}&date={date}',

    /**
     * URL
     * 获取某次服务中的印象结果
     * GET
     * 2018-03-29
     * @param {number} {service_id}
     * @param {string} {empno} // YYYY-MM-DD
     */
    getServiceImpressionResults: APPConfig.baseUrl + 'Service/GetServiceResults?empno={empno}&service_id={service_id}',

    /**
     * URL
     * 获取服务人员的历史印象
     * GET
     * 2018-03-29
     * @param {number} {empno}
     * @param {string} {rownum} // 取多少个
     */
    getPersonImpression: APPConfig.baseUrl + 'Service/GetServiceImpression?empno={empno}&rownum={rownum}',

    /**
     * URL
     * 获取服务人员的历史評價
     * GET
     * 2018-03-29
     * @param {number} {dept_id}
     * @param {number} {empno}
     * @param {string} {rownum} // 取多少个
     */
    getPersonComment: APPConfig.baseUrl + 'Service/GetServiceComment?dept_id={dept_id}&empno={empno}&rownum={rownum}',

    /**
     * URL
     * 获取服務單據
     * GET
     * 2018-04-13
     */
    getReservationList: APPConfig.baseUrl + 'Service/GetServices?docno={docno}&status={status}&contact={contact}&handler={handler}&type={type}&company_id={*COMPANY_ID}&date_fm={date_fm}&date_to={date_to}'
};
