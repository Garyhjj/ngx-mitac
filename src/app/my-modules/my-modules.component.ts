import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-my-modules',
  templateUrl: './my-modules.component.html',
  styleUrls: ['./my-modules.component.css'],
})
export class MyModulesComponent implements OnInit, OnDestroy {
  mySub: Subscription;
  isCollapsed = false;
  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}
}
