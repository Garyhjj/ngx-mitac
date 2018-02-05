import { isNumber } from "../../../../../utils/index";

export interface InputSet {
    type?: InputTypes;
    editable?: boolean;
    placeHolder?: string;
    default?: string | boolean | number;
    match?: {
        fns:{name:string,parmas:any[]}[]
        err: string
    };
    more?: any;
}

export class PhotoUpload implements InputSet {
    type?: InputTypes;
    editable?: boolean;
    default?: string;
    more?: {
        pickerFormat?: 'string' | 'array';
        maxCount?: number;
        removable?: boolean;
        addabble?: boolean;
        scanable?: boolean
    }
    constructor(opts?: any) {
        opts && Object.assign(this, opts);
        // this.more = this.more || {};
        // this.more.pickerFormat = this.more.pickerFormat || 'string';
        // this.more.maxCount = this.more.maxCount || 9;
        // this.more.removable = this.more.removable || true;
        // this.more.addabble = this.more.addabble || true;
        // this.more.scanable = this.more.scanable || true;
        this.type = 'photoUpload'
    }
}

export class ColleagueSearcher implements InputSet {
    type: InputTypes;
    default?: string | number;
    constructor(opts?: any) {
        opts && Object.assign(this, opts);
        this.type = 'colleagueSearcher';
    }
}

export class Switch implements InputSet {
    type: InputTypes;
    default?: string | boolean | number;
    falseFormat?: string | number;
    trueFormat?: string | number;
    constructor(opts?: any) {
        opts && Object.assign(this, opts);
        this.type = 'switch';
        this.falseFormat = this.falseFormat || 'N';
        this.trueFormat = this.trueFormat || 'Y';
    }

}
export interface CascaderOption {
    value: string | number,
    label: string | number,
    isLeaf?: boolean,
    children?: CascaderOption[]
}
export interface CascaderLazySet {
    value: string | number,
    lazyLayer: number,
    isLeaf?: boolean,
    api?: string,
    apiName?: string,
}
export class Cascader implements InputSet {
    type: InputTypes;
    cascaderLazySets?: CascaderLazySet[];
    placeHolder?: string;
    properties: string[];
    options: CascaderOption[]
    more?: {

    }
    constructor(opts?: any) {
        opts && Object.assign(this, opts);
        const lazySet = this.cascaderLazySets;
        if (lazySet && lazySet.length > 0) {
            lazySet.sort((a, b) => -a.lazyLayer + b.lazyLayer);
            lazySet[0].isLeaf = true;
        }
        this.type = 'cascader';
    }
}

export class DatePicker implements InputSet {
    type: InputTypes;
    placeHolder?: string;
    more?: {
        pickerFormat?: string;
        showFormat?: string;
        showTime?: boolean;
        showMode?: 'month' | 'day'
    }
    constructor(opts?: any) {
        if (opts) {
            Object.assign(this, opts);
        }
        this.placeHolder = this.placeHolder || '請選擇時間';
        this.more = this.more || {};
        this.more.pickerFormat = this.more.pickerFormat || 'YYYY-MM-DD';
        this.more.showFormat = this.more.showFormat || 'YYYY-MM-DD';
        this.more.showTime = this.more.showTime || false;
        this.more.showMode = this.more.showMode || 'day';
        this.type = 'datePicker';
    }
}

export class TimePicker implements InputSet {
    type: InputTypes;
    placeHolder?: string;
    more?: {
        pickerFormat?: string;
        showFormat?: string;
    }
    constructor(opts?: any) {
        if (opts) {
            Object.assign(this, opts);
        }
        this.placeHolder = this.placeHolder || '請選擇時間';
        this.more = this.more || {};
        this.more.pickerFormat = this.more.pickerFormat || 'HH:mm:ss';
        this.more.showFormat = this.more.showFormat || 'HH:mm:ss';
        this.type = 'timePicker';
    }
}


export class InputSetDefault implements InputSet {
    editable: boolean;
    default?: string | boolean | number;
    constructor() {
        this.editable = true;
        this.default = '';
    }
}
export class CheckboxInputSet implements InputSet {
    type: InputTypes = 'checkbox';
    editable?: boolean;
    placeHolder?: string;
    default?: string | boolean | number;
    more?: {
        options?: { property: string, value: string | number }[]
    }
    constructor(opts?: InputSet) {
        opts && Object.assign(this, opts);
        this.more = this.more || {};
        this.more.options = this.more.options || [];
        this.type = 'checkbox';
    }
    setOptions(options: any[]) {
        const newOpts = [];
        if (options && options.length > 0) {
            options.forEach(o => {
                if (typeof o === 'object') {
                    newOpts.push(o);
                } else if (typeof o === 'string' || typeof o === 'number') {
                    newOpts.push({ property: o, value: o });
                }
            })
        }
        (newOpts.length > 0) && (this.more.options = newOpts);
    }
}

export class SelectInputSet implements InputSet {
    type: InputTypes = 'select';
    editable?: boolean;
    placeHolder?: string;
    default?: string | boolean | number;
    more?: {
        options?: { property: string, value: string | number }[];
        lazyAPI?: string
    }
    constructor(opts?: InputSet) {
        opts && Object.assign(this, opts);
        this.more = this.more || {};
        this.more.options = this.more.options || [];
        this.type = 'select';
    }
    setOptions(options: any[]) {
        const newOpts = [];
        if (options && options.length > 0) {
            options.forEach(o => {
                if (typeof o === 'object') {
                    newOpts.push(o);
                } else if (typeof o === 'string' || typeof o === 'number') {
                    newOpts.push({ property: o, value: o });
                }
            })
        }
        (newOpts.length > 0) && (this.more.options = newOpts);
    }
}

export class InputSetFactory extends InputSetDefault {
    constructor(opts: InputSet = {}) {
        super();
        Object.assign(this, this.get(opts.type, opts));
    }

    private get(type: InputTypes = 'text', opts?: InputSet) {
        switch (type) {
            case 'number':
                return new NumberInputSet(opts);
            case 'select':
                return new SelectInputSet(opts);
            case 'checkbox':
                return new CheckboxInputSet(opts);
            case 'datePicker':
                return new DatePicker(opts);
            case 'timePicker':
                return new TimePicker(opts);
            case 'cascader':
                return new Cascader(opts);
            case 'switch':
                return new Switch(opts);
            case 'colleagueSearcher':
                return new ColleagueSearcher(opts);
            case 'photoUpload':
                return new PhotoUpload(opts);
            case 'textarea':
                return new TextareaInputSet(opts);
            case 'primary':
                return new PrimaryInputSet(opts);
            case 'text':
            default:
                return new TextInputSet(opts);
        }
    }
}


export type InputTypes =
    'text' | 'number' | 'date' | 'rate' | 'select' | 'datePicker' |
    'timePicker' | 'cascader' | 'switch' | 'colleagueSearcher' |
    'photoUpload' | 'textarea' | 'primary' | 'checkbox';

export class TextInputSet implements InputSet {
    type: InputTypes;
    editable?: boolean;
    placeHolder?: string;
    default?: string | boolean | number;
    match?: {
        fns:{name:string,parmas:any[]}[]
        err: string
    };
    constructor(opts?: InputSet) {
        if (opts) {
            Object.assign(this, opts);
        }
        this.type = 'text';
    }
}
export class TextareaInputSet implements InputSet {
    type: InputTypes;
    editable?: boolean;
    placeHolder?: string;
    default?: string | boolean | number;
    match?: {
        fns:{name:string,parmas:any[]}[]
        err: string
    };
    constructor(opts?: InputSet) {
        if (opts) {
            Object.assign(this, opts);
        }
        this.type = 'textarea';
    }
}

export class NumberInputSet extends TextInputSet {
    type: InputTypes;
    default?: number;
    more?: {
        min?: number,
        max?: number,
        step?: number
    }
    constructor(opts: InputSet) {
        super(opts);
        this.more = this.more || {};
        this.more.step = this.more.step || 1;
        this.more.max = isNumber(this.more.max)? this.more.max : Infinity;
        this.more.min = isNumber(this.more.min)? this.more.min : -Infinity
        this.type = 'number';
        this.default = Number(this.default);
    }
}

export class PrimaryInputSet implements InputSet {
    type: InputTypes;
    default?: number;
    constructor(opts?: InputSet) {
        if (opts) {
            Object.assign(this, opts);
        }
        this.default = this.default || 0;
        this.type = 'primary';
    }
}
