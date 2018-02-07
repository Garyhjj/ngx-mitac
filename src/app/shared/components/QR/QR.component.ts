import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-QR',
  templateUrl: './QR.component.html',
  styleUrls: ['./QR.component.css']
})
export class QRComponent implements OnInit {
  @Input() url = '';
  imgUrl: string;
  constructor() { }

  ngOnInit() {
    if(AraleQRCode) {
      this.imgUrl = new AraleQRCode({text:this.url,size: 400}).toDataURL('image/jpeg',0.8);
    }
  }

}
