export interface TableData {
    title:string;
    column_names:{property:string,value:string,type:string}[];
    data: {property:string,value:string}[];
    enOrder:boolean;
    hideList?:Object//{property:true}
}

export interface DataType {
    value:InputType;
    opts?:InputSet

}

export interface InputSet {
    editable?:boolean;
    placeHolder?:string;
    cascadable?:boolean;
    selections?:string[] | number[];
    default?:string | boolean | number;
}


export class InputSetDefault implements InputSet{
    editable:boolean;
    cascadable:boolean;
    default?:string | boolean | number;
    constructor() {
        this.editable = true;
        this.default ='';
    }
}
export class InputSetFactory extends InputSetDefault{
    constructor(type:string,opts?:InputSet){
        super();
        Object.assign(this,this.get(type,opts))
    }

    get(type:string,opts?:InputSet) {

    }
}

export enum InputType{
    number,
    text,
    textArea,
    date,
    rate
}

