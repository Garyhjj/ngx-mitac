export interface InputSet {
    type?: InputTypes;
    editable?: boolean;
    placeHolder?: string;
    cascadable?: boolean;
    selections?: string[] | number[];
    default?: string | boolean | number;
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
    default?: string | boolean | number;
    constructor(opts?: InputSet) {
        if (opts) {
            this.default = opts.default;
            this.editable = opts.editable;
            this.placeHolder = opts.placeHolder;
        }
        this.type = 'select';
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
            case 'text':
            default:
                return new TextInputSet(opts);
        }
    }
}


export type InputTypes = 'text' | 'number' | 'date' | 'rate' | 'select';

export class TextInputSet implements InputSet {
    type: InputTypes;
    editable?: boolean;
    placeHolder?: string;
    cascadable?: boolean;
    selections?: string[] | number[];
    default?: string | boolean | number;
    constructor(opts?: InputSet) {
        if (opts) {
            Object.assign(this, opts);
        }
        this.type = 'text';
    }
}

export class NumberInputSet extends TextInputSet {
    type: InputTypes;
    constructor(opts: InputSet) {
        super(opts);
        this.type = 'number';
        this.default = Number(this.default);
    }
}

