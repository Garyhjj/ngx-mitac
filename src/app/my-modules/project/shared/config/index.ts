import { APPConfig } from './../../../../shared/config/app.config';
export const projectConfig = {
  /**
   * URL
   * 任务的进度信息
   * GET
   * 2018-06-01
   * @param {number} {line_id}
   */
  getTaskProgress:
    APPConfig.baseUrl + 'projects/lines/progress?line_id={LINE_ID}',

  /**
   * URL
   * 保存任务的进度信息
   * POST
   * 2018-06-01
   */
  updateTaskProgress: APPConfig.baseUrl + 'projects/lines/progress',

  /**
   * URL
   * 删除任务的进度信息
   * DELETE
   * 2018-06-01
   * @param {number} {ID}
   */
  deleteTaskProgress: APPConfig.baseUrl + 'projects/lines/progress?id={ID}',

  /**
   * URL
   * 任务的评论信息
   * GET
   * 2018-06-03
   * @param {number} {line_id}
   */
  getTaskComments:
    APPConfig.baseUrl + 'projects/lines/comments?line_id={LINE_ID}',

  /**
   * URL
   * 保存任务的评论信息
   * POST
   * 2018-06-03
   */
  updateTaskComments: APPConfig.baseUrl + 'projects/lines/comments',

  /**
   * URL
   * 删除任务的评论信息
   * DELETE
   * 2018-06-03
   * @param {number} {ID}
   */
  deleteTaskComments: APPConfig.baseUrl + 'projects/lines/comments?id={ID}',

  /**
   * URL
   * 项目的历史记录
   * GET
   * 2018-06-03
   * @param {number} {header_id}
   * @param {number} {page}
   */
  getProjectHistory:
    APPConfig.baseUrl + 'projects/history?header_id={HEADER_ID}&page={page}',

  /**
   * URL
   * 获得项目的任务
   * GET
   * 2018-06-05
   * @param {number} {id}
   */
  getProjecLine:
    APPConfig.baseUrl +
    'projects/lines?id={id}&startDate={startDate}&endDate={endDate}&type={type}&bu={bu}&customer={customer}&owner={owner}&assignee={assignee}&model={model}',

  /**
   * URL
   * 获得项目的字任务
   * GET
   * 2018-06-06
   * @param {number} {parent}
   */
  getProjectChildren: APPConfig.baseUrl + 'projects/headers?parent={parent}',

  /**
   * URL
   * 获得所有项目
   * GET
   * 2018-06-06
   */
  getAllProject: APPConfig.baseUrl + 'projects/headers',

  /**
   * URL
   * 设置项目的父项目
   * POST
   * 2018-06-06
   */
  setProjectHeader: APPConfig.baseUrl + 'projects/headers?setParent=1',

  /**
   * URL
   * 获得项目的人员
   * get
   * 2018-07-06
   */
  getProjectPeople: APPConfig.baseUrl + 'projects/people?header_id={header_id}',
};
