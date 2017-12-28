import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  mySub:Subscription;
  constructor() { }

  ngOnInit() {
    this.resize()
    this.mySub = Observable.fromEvent(window,'resize').debounceTime(200).subscribe(() => this.resize())
  }

  ngOnDestroy() {
    this.mySub && this.mySub.unsubscribe();
  }
  resize() {
    let content:any = document.querySelector('.sub-layout, .content')
    if(content) {
      let viewHeight = document.body.offsetHeight;
      let headerHeight  = 74;
      let headers = document.getElementsByTagName('app-header');
      if(headers.length === 1){
        headerHeight = headers[0].clientHeight;
      }
      viewHeight -= headerHeight;
      content.style.height = viewHeight + 'px';
      content.style.minHeight = viewHeight + 'px';
      setTimeout(() => content.style.height = '',20);
    }
  }

}
