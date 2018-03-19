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
    getServiceDeptInfo: APPConfig.baseUrl + 'Service/GetServiceDepartments?dept_no={dept_no}&company_id={*COMPANY_ID}'
}