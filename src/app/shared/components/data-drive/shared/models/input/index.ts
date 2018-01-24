export interface InputSet {
    type?: InputTypes;
    editable?: boolean;
    placeHolder?: string;
    cascadable?: boolean;
    default?: string | boolean | number;
    match?: {
        regexp: string,
        err: string
    };
    more?: any;
}

export class DatePicker implements InputSet{
    type: InputTypes;
    placeHolder?: string;
    more?: {
        pickerFormat?: string;
        showFormat?: string;
        showTime?: boolean;
        showMode?: 'month' | 'day'
    }
    constructor(opts?:any) {
        if(opts) {
            Object.assign(this,opts);
        }
        this.more = this.more || {};
        this.more.pickerFormat = this.more.pickerFormat || 'YYYY-MM-DD';
        this.more.showFormat = this.more.showFormat || 'YYYY-MM-DD';
        this.more.showTime = this.more.showTime || false;
        this.more.showMode = this.more.showMode || 'day';
        this.type = 'datePicker';
    }
}


export class InputSetDefault implements InputSet {
    editable: boolean;
    cascadable: boolean;
    default?: string | boolean | number;
    constructor() {
        this.editable = true;
        this.default = '';
    }
}

export class SelectInputSet implements InputSet {
    type: InputTypes = 'select';
    editable?: boolean;
    placeHolder?: string;
    cascadable?: boolean;
    default?: string | boolean | number;
    more?: {
        options?:{property:string, value:string | number}[]
    }
    constructor(opts?: InputSet) {
        opts && Object.assign(this, opts);
        this.more = this.more || {};
        this.more.options = this.more.options || [];
        this.type = 'select';
    }
    setOptions(options:any[]) {
        const newOpts = [];
        if(options && options.length > 0) {
            options.forEach(o => {
                if(typeof o === 'object') {
                    newOpts.push(o);
                }else if(typeof o === 'string' || typeof o === 'number'){
                    newOpts.push({property:o, value:o});
                }
            })
        }
        (newOpts.length >0) && (this.more.options = newOpts);
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
                case 'datePicker':
                return new DatePicker(opts);
            case 'text':
            default:
                return new TextInputSet(opts);
        }
    }
}


export type InputTypes = 'text' | 'number' | 'date' | 'rate' | 'select' | 'datePicker' | 'timePicker';

export class TextInputSet implements InputSet {
    type: InputTypes;
    editable?: boolean;
    placeHolder?: string;
    cascadable?: boolean;
    default?: string | boolean | number;
    match?: {
        regexp: string,
        err: string
    }
    constructor(opts?: InputSet) {
        if (opts) {
            Object.assign(this, opts);
        }
        this.type = 'text';
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
        this.more.max = this.more.max || Infinity;
        this.more.min = this.more.min || -Infinity
        this.type = 'number';
        this.default = Number(this.default);
    }
}

