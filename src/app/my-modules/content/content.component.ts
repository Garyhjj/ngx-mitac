import { BreadcrumbCancel } from './../../core/actions/breadcrumb.action';
import { MyStore, BreadcrumbState } from './../../core/store';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent implements OnInit, OnDestroy {
  tabIdx;
  breadcrumb: BreadcrumbState[];
  sub: Subscription;
  constructor(
    private store$: Store<MyStore>,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.sub = this.store$
      .select((s: MyStore) => s.breadcrumbReducer)
      .subscribe(b => {
        this.breadcrumb = b;
        const idx = b.findIndex(r => r.active);
        this.tabIdx = idx > -1 ? idx : b.length - 1;
      });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  tabIdxChange(idx: number) {
    if (idx > -1) {
      this.router.navigate([this.breadcrumb[idx].routeUrl]);
    }
  }

  closeTab(tab) {
    this.store$.dispatch(new BreadcrumbCancel(tab));
    if (this.breadcrumb.length <= 0) {
      this.router.navigateByUrl('/modules');
    }
  }
}
