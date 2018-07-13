import * as moment from 'moment';
import { UserState } from '../../core/store';

/**
 * 对能改变数组的方法添加钩子函数
 *
 * @param {any[]} array
 */
export function bindEventForArray(array: any[], cb: Function) {
  let fun = ['push', 'pop', 'sort', 'reverse', 'unshift', 'shift', 'splice'];
  fun.forEach(item => {
    let _prototype = Array.prototype[item];
    let that = this;
    array[item] = function() {
      let new_value = _prototype.apply(this, arguments);
      cb();
      return new_value;
    };
  });
}

/**
 *  节流，限制事件的触发频率
 *
 * @param {*} 方法
 * @param {Object} 上下文
 * @param {any[]} 需要传入的参数
 * @param {number} [during=100] 间隔的时间
 */
export const throttle = (
  method: any,
  context: Object,
  args: any[] = [],
  during: number = 200,
) => {
  clearTimeout(method.tId);
  method.tId = setTimeout(function() {
    method.call(context, ...args);
  }, during);
  return method.tId;
};

export const replaceQuery = (url: string, query: any, user?: UserState) => {
  const prefix = '*';
  if (url && query) {
    // tslint:disable-next-line:forin
    for (let prop in query) {
      const queryVal = query[prop];
      url = url.replace(
        `{${prop}}`,
        queryVal || queryVal === 0 ? queryVal : '',
      );
    }
    if (user) {
      // tslint:disable-next-line:forin
      for (let prop in user) {
        const userVal = user[prop];
        url = url.replace(
          `{${prefix + prop}}`,
          userVal || userVal === 0 ? userVal : '',
        );
      }
    }
    url = url.replace(/\{\w+\}/g, '');
  }

  return url;
};
export const stringify = d => {
  if (typeof d === 'object') {
    return JSON.stringify(d);
  } else {
    return d;
  }
};
export const parse = d => {
  if (typeof d === 'string' && d) {
    return JSON.parse(d);
  } else {
    return d;
  }
};
export const deepClone = d => {
  if (typeof d === 'object') {
    return JSON.parse(JSON.stringify(d));
  } else {
    return d;
  }
};
export const isArray = ar => {
  return Object.prototype.toString.call(ar) === '[object Array]';
};
export const isDate = date => {
  return moment(date).isValid();
};
export const isNumber = num => {
  return !Number.isNaN(Number(num)) && num !== null;
};
export const sortUtils = {
  byCharCode: (a: string, b: string, isAscend = true) => {
    if (typeof a !== 'string' || typeof b !== 'string') {
      return 0;
    }
    const res = a.charCodeAt(0) - b.charCodeAt(0);
    return isAscend ? res : -res;
  },
  byDate: (a: string, b: string, isAscend = true, format?: string) => {
    const toDateA = moment(a, format);
    const toDateB = moment(b, format);
    if (!toDateA.isValid() || !toDateB.isValid()) {
      return 0;
    }
    const res = toDateA.toDate().getTime() - toDateB.toDate().getTime();
    return isAscend ? res : -res;
  },
  byTime: (
    a: string,
    b: string,
    isAscend = true,
    format: string = 'HH:mm:ss',
  ) => {
    const toDateA = moment('2018-01-01T ' + a, 'YYYY-MM-DDT ' + format);
    const toDateB = moment('2018-01-01T ' + b, 'YYYY-MM-DDT ' + format);
    if (!toDateA.isValid() || !toDateB.isValid()) {
      return 0;
    }
    const res = toDateA.toDate().getTime() - toDateB.toDate().getTime();
    return isAscend ? res : -res;
  },
  byNumber: (
    a: number | string,
    b: number | string,
    isAscend = true,
    from?: number,
    to?: number,
  ) => {
    const prefixDo = t => {
      if (typeof t === 'string') {
        const _fr = from || 0;
        const _to = to || t.length;
        t = t.slice(_fr, _to);
      }
      return t;
    };
    a = prefixDo(a);
    b = prefixDo(b);
    // if (!isNumber(a) || !isNumber(b)) {
    //   return 0;
    // }
    a = isNumber(a) ? +a : 0;
    b = isNumber(b) ? +b : 0;
    const res = Number(a) - Number(b);
    return isAscend ? res : -res;
  },
};

export const copyToClipboard = (value: string): Promise<string> => {
  const promise = new Promise<string>(
    (resolve, reject): void => {
      let copyTextArea = null as HTMLTextAreaElement;
      try {
        copyTextArea = document.createElement('textarea');
        copyTextArea.style.height = '0px';
        copyTextArea.style.opacity = '0';
        copyTextArea.style.width = '0px';
        document.body.appendChild(copyTextArea);
        copyTextArea.value = value;
        copyTextArea.select();
        document.execCommand('copy');
        resolve(value);
      } finally {
        if (copyTextArea && copyTextArea.parentNode) {
          copyTextArea.parentNode.removeChild(copyTextArea);
        }
      }
    },
  );
  return promise;
};
