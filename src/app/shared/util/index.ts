/**
   * 对能改变数组的方法添加钩子函数
   * 
   * @param {any[]} array 
   */
  export function bindEventForArray(array: any[],cb:Function) {
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