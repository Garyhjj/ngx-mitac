import tongwenSt from './tongwen/tongwen-st';
import tongwenTs from './tongwen/tongwen-ts';

export default {
    sify: tongwenTs,
    tify: tongwenSt,
};
export const sify = tongwenTs;
export const tify = tongwenSt;

export const replaceQuery =function (url:string, query:object) {
    if(!url) return url;
    for (let prop in query) {
        url = url.replace(`{${prop}}`, query[prop])
    }
    return url;
}