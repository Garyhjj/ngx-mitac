import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-application-IT',
  templateUrl: './application-IT.component.html',
  styleUrls: ['./application-IT.component.css']
})
export class ApplicationITComponent implements OnInit {

  current = 0;

  index = 'First-content';

  pre() {
    this.current -= 1;
    this.changeContent();
  }

  next() {
    this.current += 1;
    this.changeContent();
  }

  done() {
    this._message.success('done');
  }

  changeContent() {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }
  constructor(private _message: NzMessageService) {
  }
  ngOnInit() {
  }

}
