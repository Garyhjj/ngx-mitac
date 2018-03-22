import { APPConfig } from './../../../../shared/config/app.config';
export const reservationConfig = {
    /**
     * URL
     * 获取所有的服务部门
     * GET
     * 2018-03-19
     * @param {number} {dept_id}
     * @param {string} {date} // YYYY-MM-DD
     */
    getServiceDeptInfo: APPConfig.baseUrl + 'Service/GetServiceDepartments?dept_no={dept_no}&company_id={*COMPANY_ID}',

    /**
     * URL
     * 新增或更新服务
     * POST
     * 2018-03-20
     */
    updateService: APPConfig.baseUrl + 'reservations/applications',

    /**
     * URL
     * 查询服务时间段的设置
     * GET
     * 2018-03-20
     * @param {number} {dept_id}
     */
    getServiceTime: APPConfig.baseUrl + 'Service/GetServiceTimes?dept_id={dept_id}'
}