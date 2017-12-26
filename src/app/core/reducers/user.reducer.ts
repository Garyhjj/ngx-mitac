import { UserState, MyModule } from './../store';
import { USER_LOGOUT, USER_UPDATE } from './../actions/user.action';

import * as user from '../actions/user.action';

const initialState: UserState = (() => {
    let localUserStr = localStorage.getItem('currentUser');
    if (localUserStr) {
        let user: UserState = Object.assign({}, JSON.parse(localUserStr));
        if (user.modules instanceof Array) {
            user.modules = user.modules.map((m) => {
                m.TIPS = 0;
                return m;
            })
        }
        if (user.hasOwnProperty('rememberPWD') && !user.rememberPWD) {
            user.password = '';
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return user;
    } else {
        return {};
    }
})();


export function userReducer(state = initialState, action: user.UserActions): UserState {
    switch (action.type) {
        case user.USER_LOGIN:
            if (state.USER_NAME === action.payload.USER_NAME) {
                return update(state, action);
            } else {
                localStorage.setItem('currentUser', JSON.stringify(action.payload));
                return action.payload
            }
        case user.USER_LOGOUT:
            if (state.rememberPWD) {
                return state;
            } else {
                let new_user = Object.assign(state, { password: '' });
                localStorage.setItem('currentUser', JSON.stringify(new_user));
                return new_user
            }
        case user.USER_UPDATE:
            return update(state, action);
        case user.USER_CHINESECOV:
            return Object.assign(state, action.payload);
        case user.USER_CLEAR:
            localStorage.removeItem('currentUser')
            return {};
        case user.USER_UPDATE_PRIVILEGE:
            let module = action.payload;
            state.privilege = state.privilege || [];
            let idx = state.privilege.findIndex((l) => l.moduleID === module.moduleID);
            if (idx > -1) {
                state.privilege[idx] = module;
            } else {
                state.privilege.push(module);
            }
            localStorage.setItem('currentUser', JSON.stringify(state));
            return Object.assign({}, state);
        case user.USER_UPDATE_MODULE:
            let _module = action.payload;
            state = updateModule(state, _module);
            localStorage.setItem('currentUser', JSON.stringify(state));
            return Object.assign({}, state);
        case user.USER_UPDATE_MODULES:
            let _modules = action.payload;
            _modules.forEach((m => {
                state = updateModule(state, m);
            }))
            localStorage.setItem('currentUser', JSON.stringify(state));
            return Object.assign({}, state);
        default:
            return state;
    }
}

const updateModule = (state: UserState, m: MyModule) => {
    let modules = state.modules = state.modules || [];
    let index = modules.findIndex((l) => l.MODULE_ID === m.MODULE_ID);
    if (index > -1) {
        let org = state.modules[index];
        Object.assign(org,m);
        state.modules[index] = org;
    } else {
        state.modules.push(m);
    }
    return state;
}

const update = (state: UserState, action: user.UserActions) => {
    let new_user = Object.assign(state, action.payload);
    localStorage.setItem('currentUser', JSON.stringify(new_user));
    return new_user;
}