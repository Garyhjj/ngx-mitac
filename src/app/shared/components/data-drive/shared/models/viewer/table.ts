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
            matches: string[][];
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
}
export class TabelViewSet implements DataViewSet {
    type: DataViewType;
    title?: string;
    more: TabelViewSetMore;

    constructor(opts: DataViewSet = {}) {
        if (opts.more) {
            if (!opts.more.title) {
                opts.more.title = { enable: true };
            }
            if (!opts.more.border_y) {
                opts.more.border_y = { enable: false };
            }
            if (!opts.more.pageSet && !opts.more.pageSet.count) {
                opts.more.pageSet = { enable: true, count: 10 };
            }
            if (!opts.more.size) {
                opts.more.size = 'default';
            }
            if (!opts.more.footer) {
                opts.more.footer = { enable: false, content: '' };
            }
        }
        // this.more = this.more || {
        //     title: { enable: true },
        //     pageSet: { enable: false, count: 10 },
        //     size: 'default', border_y: { enable: false },
        //     header: {
        //         textColor: '#fff',
        //         bgColor: '#000',
        //         textSize: '1.8rem'
        //     },
        //     body: {
        //         textColor: 'green',
        //         bgColor: '#000',
        //         textSize: '1.8rem',
        //         rule: {
        //             match: [['ATA_MSL_TIME', '^\s*$']],
        //             textColor: 'red',
        //         }
        //     },
        //     fixedHeader: {
        //         enable: true,
        //         scrollHeight: 'auto',
        //         autoScroll: {
        //             interval: 1000,
        //             loop: true
        //         }
        //     },
        //     footer: { enable: false, content: '' }
        // };
        if (opts) {
            Object.assign(this, opts);
        }
        this.type = 'table';
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
