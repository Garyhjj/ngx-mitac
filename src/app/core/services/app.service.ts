import { tify } from '../../shared/utils/chinese-conv';
import { APIGlobalConfig } from './../../shared/config/api-global.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { replaceQuery } from '../../shared/utils/index';

@Injectable()
export class AppService {

    constructor(
        private http: HttpClient,
    ) { }

    getColleague(name: string): Observable<any> {
        if (!(typeof name === 'string') || !name) return Observable.of([]);
        let emp_name = name.toUpperCase();
        emp_name = tify(emp_name).replace(/^\"/g, '').replace(/\"$/g, '');
        return this.http.get(replaceQuery(APIGlobalConfig.getAgentUrl, { emp_name })).map((cs:{AGENT_NAME:string}[]) => cs.map(c => c&& c.AGENT_NAME));
    }

}