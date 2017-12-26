import { UserState } from './store';
export class myStore{
    breadcrumbReducer: BreadcrumbState[];
    userReducer: UserState;
}

export interface BreadcrumbState{
    routeName:string
}

export interface UserState{
    AVATAR_URL?: string;
    COMPANY_ID?: string;
    DEPTNO?: string;
    DEPT_NAME?: string;
    EMAIL?: string;
    EMPNO?: string;
    ID?: number;
    JOB_TITLE?: string;
    MOBILE?: string;
    NICK_NAME?: string;
    TELEPHONE?: string;
    USER_NAME?: string;
    password?: string;
    modules?: MyModule[];
    rememberPWD?: boolean;
    privilege?: Privilege[];
}


export interface MyModule {
    GROUP_ID:number;
    DISPLAY:'Y' | 'N';
    GROUP_NAME:string;
    ICON_URL:string;
    MODULE_DESCRIPTION:string;
    MODULE_ID:number;
    MODULE_NAME:string;
    TIPS:number;
}

export interface Privilege {
    moduleID:number;
    function:{FUNCTION_ID:string,FUNCTION_NAME:string,FUNCTION_URL:string,ROLE_ID:number,ROLE_NAME:string}[];
}