import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  mySub: Subscription;
  isCollapsed = false;
  constructor() { }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
