import { UserState, MyModule, Privilege } from './../store';
import { Action } from '@ngrx/store';

export const USER_LOGIN = '[User] login';
export const USER_UPDATE = '[User] update ';
export const USER_LOGOUT = '[User] logout';
export const USER_CLEAR = '[User] clear';
export const USER_CHINESECOV = '[User] chineseConv';
export const USER_UPDATE_PRIVILEGE = '[User] update privilege';
export const USER_UPDATE_MODULE = '[User] update module';
export const USER_UPDATE_MODULES = '[User] update modules';

export class UserLogin implements Action {
  readonly type = USER_LOGIN;
  payload: UserState;
  constructor(token: UserState) {
    this.payload = token;
  }
}

export class UserUpdateModule implements Action {
  readonly type = USER_UPDATE_MODULE;
  payload: MyModule;
  constructor(token: MyModule) {
    this.payload = token;
  }
}

export class UserUpdateModules implements Action {
  readonly type = USER_UPDATE_MODULES;
  payload: MyModule[];
  constructor(token: MyModule[]) {
    this.payload = token;
  }
}

export class UserUpdatePrivilege implements Action {
  readonly type = USER_UPDATE_PRIVILEGE;
  payload: Privilege[];
  constructor(token: Privilege[]) {
    this.payload = token;
  }
}

export class UserLogout implements Action {
  readonly type = USER_LOGOUT;
  payload: any;
}

export class UserClear implements Action {
  readonly type = USER_CLEAR;
  payload: any;
}

export class UserChineseConv implements Action {
  readonly type = USER_CHINESECOV;
  payload: any;
  constructor(avatar: any) {
    this.payload = avatar;
  }
}

export class UserUpdate implements Action {
  readonly type = USER_UPDATE;
  payload: any;
  constructor(avatar: any) {
    this.payload = avatar;
  }
}


export type UserActions = UserLogin | UserLogout | UserUpdate | UserChineseConv | UserClear | UserUpdatePrivilege | UserUpdateModule | UserUpdateModules;
