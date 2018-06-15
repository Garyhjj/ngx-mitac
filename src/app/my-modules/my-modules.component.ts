import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-my-modules',
  templateUrl: './my-modules.component.html',
  styleUrls: ['./my-modules.component.css'],
})
export class MyModulesComponent implements OnInit, OnDestroy {
  mySub: Subscription;
  isCollapsed = false;
  private doc: Document;
  constructor(@Inject(DOCUMENT) doc: any) {
    this.doc = doc;
  }

  ngOnInit() {
    if (this.doc.body.clientWidth < 993) {
      this.isCollapsed = true;
    }
  }

  ngOnDestroy() {}
}
