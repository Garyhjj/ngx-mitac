import { NzModalService } from 'ng-zorro-antd';
import { copyToClipboard } from './../../utils/index';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-QR',
  templateUrl: './QR.component.html',
  styleUrls: ['./QR.component.css']
})
export class QRComponent implements OnInit {
  @Input() url = '';
  @Input() router = '';
  imgUrl: string;
  constructor(private confirmServ: NzModalService) { }

  ngOnInit() {
    if(AraleQRCode) {
      this.imgUrl = new AraleQRCode({text:this.url,size: 400}).toDataURL('image/jpeg',0.8);
    }
  }

  getUrl(){
    const urlList = document.URL.split('/');
    const wholeUrl = urlList[0]+'//'+urlList[2]+ this.router;
    copyToClipboard(wholeUrl).then((u) => {
      this.confirmServ.success({
        title: `已把地址複製到剪切板中`,
        zIndex: 9999
      });
    }).catch((err) => 
    this.confirmServ.error({
      title: `複製出錯，請重試，或聯繫MIS`,
      zIndex: 9999
    }))
  }

}
