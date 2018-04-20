import { DataViewType, DataViewSet } from './index';
export interface TabelViewSetMore {
    title?: {
        enable: boolean;
    };
    border_y?: {
        enable: boolean;
    };
    header?: {
        textColor?: string;
        textSize?: string;
        bgColor?: string
    };
    body?: {
        textColor?: string;
        textSize?: string;
        bgColor?: string;
        rules?: {
            matches: any[][];
            textColor?: string;
            textSize?: string;
            bgColor?: string;
        }[]
    };
    addOrder?: boolean;
    fixedHeader?: {
        enable: boolean;
        scrollHeight?: number | 'auto';
        width?: string[];
        autoScroll?: {
            interval: number;
            loop?: boolean
        }
    };
    pageSet?: {
        enable: boolean;
        count?: number;
    };
    size?: 'default' | 'middle' | 'small';
    footer?: {
        enable: boolean;
        content: string;
    };
    showAction?: boolean;
    paramsOut?: {
        name: string,
        params?: string[]
    };
    linkToPhone?: {
        name: string,
        url: string,
        local?: string
    };
}
export class TabelViewSet implements DataViewSet {
    type: DataViewType;
    title?: string;
    more: TabelViewSetMore;
    hasInited?: boolean;
    constructor(opts: DataViewSet = {}) {
        if (opts) {
            Object.assign(this, opts);
        }
        this.more = this.more || {};
        this.more.title = this.more.title || { enable: true };
        this.more.border_y = this.more.border_y || { enable: false };
        this.more.pageSet = this.more.pageSet || { enable: true, count: 10 };
        this.more.pageSet.count = this.more.pageSet.count || 10;
        this.more.size = this.more.size || 'default';
        this.more.footer = this.more.footer || { enable: false, content: '' };
        this.type = 'table';
        this.hasInited = true;
    }
    changeHeaderFontSize(size: string) {
        this.more = this.more || {};
        this.more.header = this.more.header || {};
        this.more.header.textSize = size;
    }
    changeBodyFontSize(size: string) {
        this.more = this.more || {};
        this.more.body = this.more.body || {};
        this.more.body.textSize = size;
    }

}
