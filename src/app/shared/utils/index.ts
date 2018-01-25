/**
   * 对能改变数组的方法添加钩子函数
   * 
   * @param {any[]} array 
   */
export function bindEventForArray(array: any[], cb: Function) {
  let fun = ['push', 'pop', 'sort', 'reverse', 'unshift', 'shift', 'splice'];
  fun.forEach((item) => {
    let _prototype = Array.prototype[item];
    let that = this;
    array[item] = function () {
      let new_value = _prototype.apply(this, arguments);
      cb();
      return new_value;
    }
  })
}


/**
 *  节流，限制事件的触发频率
 * 
 * @param {*} 方法 
 * @param {Object} 上下文 
 * @param {any[]} 需要传入的参数 
 * @param {number} [during=100] 间隔的时间 
 */
export const throttle = (method: any, context: Object, args: any[] = [], during: number = 200) => {
  clearTimeout(method.tId);
  method.tId = setTimeout(function () {
    method.call(context, ...args);
  }, during);
}

export const replaceQuery = (url: string, query: any) => {
  if (url && query) {
    for (let prop in query) {
      url = url.replace(`{${prop}}`, query[prop])
    }
    url = url.replace(/\{\w+\}/g, '');
  }

  return url;
}