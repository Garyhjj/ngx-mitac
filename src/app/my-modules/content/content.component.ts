import { Breadcrumb_Cancel } from './../../core/actions/breadcrumb.action';
import { myStore, BreadcrumbState } from './../../core/store';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnDestroy {
  tabIdx;
  breadcrumb: BreadcrumbState[];
  sub: Subscription;
  constructor(
    private store$: Store<myStore>,
    private router: Router
  ) { }

  ngOnInit() {
    this.sub = this.store$.select((s: myStore) => s.breadcrumbReducer).subscribe((b) => {
      this.breadcrumb = b;
      const idx = b.findIndex(r => r.active);
      this.tabIdx = idx > -1? idx: b.length-1;
    });
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }

  tabIdxChange(idx: number) {
    if(idx > -1) {
      this.router.navigate([this.breadcrumb[idx].routeUrl]);
    }
  }

  closeTab(tab) {
    this.store$.dispatch(new Breadcrumb_Cancel(tab));
  }

}
