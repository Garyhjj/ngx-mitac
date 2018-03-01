import { Observable } from 'rxjs/Observable';
import { FormGroup } from '@angular/forms';
import { AdditionalFn } from './additionalFn/index';
import { TableDataModel, TableData } from './table-data/index';
import { SearchItemSet } from './searcher';
import { DataViewSet, TabelViewSetMore, DataViewType } from './viewer/index';
import { BehaviorSubject } from 'rxjs/Rx';
import { bindEventForArray, isArray } from '../../../../utils/index';
import { DataViewSetFactory } from './viewer/index';
import { SelfStoreSet, SelfStore } from './self-store/index';
import { InputSetFactory } from './input/index';
import { Subject } from 'rxjs/Subject';
export * from './viewer';
export * from './self-store';
export * from './table-data';
export * from './input';
export interface DataDriveOptions {
    id: number;
    searchSets?: SearchItemSet[];
    updateSets?: SearchItemSet[];
    additionalFn?: AdditionalFn;
    tableData: TableData;
    APIs: {
        search: string;
        delete?: string;
        add?: string;
        update?: string;
    };
    dataViewSet?: DataViewSet;
    selfHideLists?: string[];
    otherDataViewSets?: DataViewSet[];
}

export class DataDrive implements DataDriveOptions {
    private user: string;
    private _selfHideLists?: string[];
    private dataViewSetFactory;
    private inputSetFactory;
    private selfStoreSet;
    private tableDataModel;
    private selfStore;
    private hideListSubject = new BehaviorSubject<string[]>([]);
    private isGetingDataSubject = new BehaviorSubject<boolean>(false);
    private isShowModalSubject = new BehaviorSubject<boolean>(false);
    private selfSearchDataSubject = new Subject<any[]>();
    private scrollToBottomSubject = new Subject<any>();
    eventSubject = new Subject<string>();
    eventsQueue = {};
    lastestSearchParams;
    id: number;
    searchSets?: SearchItemSet[];
    updateSets?: SearchItemSet[];
    tableData: TableDataModel;
    canAutoUpdate: boolean = true;
    additionalFn?: AdditionalFn;
    APIs: {
        search: string;
        delete?: string;
        add?: string;
        update?: string;
    };
    dataViewSet?: DataViewSet;
    allHideLists: string[];
    otherDataViewSets?: DataViewSet[];
    constructor(
        opts: DataDriveOptions,
        user: string = 'default',
        dataViewSetFactory: DataViewSetFactory = DataViewSetFactory,
        inputSetFactory = InputSetFactory,
        selfStoreSet = SelfStoreSet,
        selfStore = SelfStore,
        tableDataModel = TableDataModel
    ) {
        Object.assign(this, opts);
        this.user = user;
        this.dataViewSetFactory = dataViewSetFactory;
        this.inputSetFactory = inputSetFactory;
        this.selfStoreSet = new selfStoreSet();
        this.selfStore = selfStore;
        this.tableDataModel = tableDataModel;
        this.init();
    }
    set isGetingData(status: boolean) {
        this.isGetingDataSubject.next(status);
    }
    set selfHideLists(ls: string[]) {
        this._selfHideLists = ls;
        bindEventForArray(this._selfHideLists, this.updateSelfStoreSet.bind(this));
        this.updateSelfStoreSet();
    }
    set modalSataus(s: boolean) {
        this.isShowModalSubject.next(s);
    }
    private updateSelfStoreSet() {
        const storeSet = new this.selfStore(this.user, [{ id: this.id, prefer: this._selfHideLists }]);
        this.selfStoreSet.update(storeSet);
        this.combineHideLists();
    }
    get selfHideLists() {
        return this._selfHideLists;
    }
    private combineHideLists() {
        this._selfHideLists = this._selfHideLists || [];
        const baseHideLists: string[] = this.dataViewSet.hideLists || [];
        this.allHideLists = this._selfHideLists.concat(baseHideLists).filter(function (ele, index, array) {
            return index === array.indexOf(ele);
        });
        this.hideListSubject.next(this.allHideLists);
    }
    private initHideLists() {
        this._selfHideLists = this.selfStoreSet.getSetByUserAndId(this.user, this.id);
        this.combineHideLists();
    }
    isDataAddable() {
        return !!this.tableData.addable;
    }
    isDataEdditable() {
        return !!this.tableData.editable;
    }
    isDataDeletable() {
        return !!this.tableData.deletable;
    }
    isCompanyLimited() {
        return this.tableData.isCompanyLimited;
    }

    addDefaultSearchParams(p) {
        if (typeof p === 'object') {
            this.tableData.defaultSearchParams = this.tableData.defaultSearchParams || {};
            Object.assign(this.tableData.defaultSearchParams, p);
        }
    }

    getData() {
        if (this.tableData.data && this.tableData.data.length > 0) {
            return this.tableData.data
        } else {
            return []
        }
    }
    observeHideLists() {
        return this.hideListSubject.asObservable();
    }
    observeIsGettingData() {
        return this.isGetingDataSubject.asObservable();
    }
    observeIsShowModal() {
        return this.isShowModalSubject.asObservable();
    }
    onUpdateFormShow(cb: (fg: FormGroup, sub: Subject<string>, InputList: any[]) => void) {
        this.on('updateFormShow', cb);
    }
    onParamsOut(cb: (data) => void) {
        this.on('paramsOut', cb);
    }
    beforeUpdateSubmit(cb: (fg: FormGroup, sub: Subject<string>) => void) {
        this.on('beforeUpdateSubmit', cb);
    }

    beforeSearch(cb: (data: any) => any) {
        this.on('beforeSearch', cb);
    }

    afterDataInit(cb: () => void) {
        this.on('afterDataInit', cb);
    }
    beforeInitTableData(cb: (data: any[]) => any | void) {
        this.on('beforeInitTableData', cb);
    }

    onUpdateData(cb: (data: any) => any | void) {
        this.on('onUpdateData', cb);
    }

    runOnUpdateData(data) {
        return this.onAlterData('onUpdateData', data);
    }

    changeUpdateViewer(cb: (data: any) => void) {
        if (this.eventsQueue['changeUpdateViewer']) {
            this.eventsQueue[0] = cb;
        } else {
            this.eventsQueue['changeUpdateViewer'] = [cb];
        }
    }
    runChangeUpdateViewer(idx?) {
        const eventQueue: Array<Function> = this.eventsQueue['changeUpdateViewer'] || [];
        if (eventQueue.length > 0) {
            const data = this.getData()[idx];
            const out: any = {};
            data && data.forEach(d => {
                out[d.property] = d.value;
            })
            eventQueue[0](out)
            return true;
        } else {
            return false;
        }
    }
    changeUpdateWay(cb: (data: any) => Observable<any> | boolean) {
        if (this.eventsQueue['changeUpdateWay']) {
            this.eventsQueue[0] = cb;
        } else {
            this.eventsQueue['changeUpdateWay'] = [cb];
        }
    }
    runChangeUpdateWay(data) {
        const eventQueue: Array<Function> = this.eventsQueue['changeUpdateWay'] || [];
        if (eventQueue.length > 0) {
            return eventQueue[0](data);
        }
        return false;
    }
    emitAfterDataInit() {
        this.eventSubject.next('afterDataInit');
    }
    emitParamsOut(data) {
        this.emitEvent('paramsOut', data)
    }

    emitEvent(name: string, ...p) {
        const eventQueue: Array<Function> = this.eventsQueue[name] || [];
        let canContinue = true;
        for (let i = 0; i < eventQueue.length; i++) {
            const cb = eventQueue[i]
            if (cb) {
                if (cb(...p) === false) {
                    canContinue = false;
                }
            }
        }
        return canContinue;
    }

    on(eventType: string, cb: Function): void {
        if (this.eventsQueue[eventType]) {
            this.eventsQueue[eventType].push(cb);
        } else {
            this.eventsQueue[eventType] = [cb];
        }
    }

    onAlterData(eventName: string, data: any) {
        const eventQueue: Array<Function> = this.eventsQueue[eventName] || [];
        for (let i = 0; i < eventQueue.length; i++) {
            const cb = eventQueue[i]
            if (cb) {
                const res = cb(data);
                if (typeof res === 'object') {
                    data = res;
                }
            }
        }
        return data;
    }

    runBeforeInitTableData(data) {
        return this.onAlterData('beforeInitTableData', data);
    }
    runBeforeSearch(data: any) {
        const eventQueue: Array<Function> = this.eventsQueue['beforeSearch'] || [];
        if (typeof data !== 'object') return data;
        for (let i = 0; i < eventQueue.length; i++) {
            const cb = eventQueue[i]
            if (cb) {
                const res = cb(Object.assign({}, data));
                if (typeof res === 'object') {
                    data = Object.assign({}, data, res);
                }
            }
        }
        return data;
    }

    runBeforeUpdateSubmit(fg: FormGroup, globalUpdateErrSubject: Subject<string>) {
        return this.emitEvent('beforeUpdateSubmit', fg, globalUpdateErrSubject)
    }

    private subscribeEvent() {
        this.eventSubject.subscribe(type => {
            const eventQueue: Array<Function> = this.eventsQueue[type] || [];
            switch (type) {
                default:
                    eventQueue.forEach(cb => {
                        if (cb) {
                            cb();
                        }
                    });
            }
        })
    }

    hasScrolledToBottom() {
        this.scrollToBottomSubject.next(1);
    }

    observeScrollToBottom() {
        return this.scrollToBottomSubject.asObservable();
    }

    selfUpdateTableData(data) {
        if (isArray(data)) {
            this.selfSearchDataSubject.next(data);
        }
    }

    observeSelfUpdateTableData() {
        return this.selfSearchDataSubject.asObservable();
    }

    updateFormGroupInited(fg: FormGroup, globalUpdateErrSubject: Subject<string>, inputTypeList) {
        return this.emitEvent('updateFormShow', fg, globalUpdateErrSubject, inputTypeList)
    }

    setParamsOut(name: string, params?: string[]) {
        if (this.dataViewSet.type === 'table') {
            const more: TabelViewSetMore = this.dataViewSet.more || {};
            more.paramsOut = {
                name: name,
                params: params
            }
        }
    }

    switchViewType(type: DataViewType) {
        const currentView = this.dataViewSet;
        if(this.otherDataViewSets) {
            const targetIdx = this.otherDataViewSets.findIndex(c => c.type === type);
            if(targetIdx > -1) {
                const target = this.otherDataViewSets.splice(targetIdx, 1)[0];
                this.otherDataViewSets.push(currentView);
                target.tempAddition = currentView.tempAddition;
                this.dataViewSet = target;
                this.initDataViewSet();
            }
        }
    }

    setViewTempAddtion(a) {
        this.dataViewSet.tempAddition = a;
    }

    private init() {
        this.initDataViewSet();
        this.initSearchSets();
        this.initUpdateSets();
        this.initTableData();
        this.initHideLists();
        this.subscribeEvent();
    }

    private initUpdateSets() {
        if (this.updateSets && this.updateSets.length > 0) {
            this.updateSets = this.updateSets.map(s => {
                s.InputOpts = new this.inputSetFactory(s.InputOpts);
                return s;
            });
        }
    }

    private initSearchSets() {
        if (this.searchSets && this.searchSets.length > 0) {
            this.searchSets = this.searchSets.map(s => {
                s.InputOpts = new this.inputSetFactory(s.InputOpts);
                return s;
            });
        }
    }

    private initDataViewSet() {
        this.dataViewSet = new this.dataViewSetFactory(this.dataViewSet);
    }
    private initTableData() {
        this.tableData = new this.tableDataModel(this.tableData);
    }
}


