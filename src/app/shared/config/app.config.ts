import { environment } from './../../../environments/environment';
const formatUrl = 'https://miwebapi.mic.com.cn/',
  // devUrl = 'http://10.86.3.57:8082/';
  devUrl = 'http://localhost:8082/';

export class APPConfig {
  // static baseUrl: string = 'https://miwebapi.mic.com.cn/';
  // static baseUrl: string = 'http://webapi.mic.com.cn/';
  static baseUrl = environment.production ? formatUrl : devUrl;
}
