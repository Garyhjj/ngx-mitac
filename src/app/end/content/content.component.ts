import { BreadcrumbModel } from './../../core/models/breadcrumb.model';
import { BreadcrumbCancel } from './../../core/actions/breadcrumb.action';
import { MyStore, BreadcrumbState } from './../../core/store';
import { Store } from '@ngrx/store';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit, OnDestroy {
  tabIdx;
  breadcrumb: BreadcrumbState[];
  sub: Subscription;
  year = new Date().getFullYear();
  constructor(
    private store$: Store<MyStore>,
    private router: Router,
    private ref: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.sub = this.store$
      .select((s: MyStore) => s.breadcrumbReducer)
      .subscribe(b => {
        this.breadcrumb = b;
        const idx = b.findIndex(r => r.active);
        this.tabIdx = idx > -1 ? idx : b.length - 1;
        this.ref.markForCheck();
      });
  }

  ngOnDestroy() {
    // tslint:disable-next-line:no-unused-expression
    this.sub && this.sub.unsubscribe();
  }

  tabIdxChange(idx: number) {
    if (idx > -1) {
      if (this.breadcrumb[idx]) {
        this.router.navigate([this.breadcrumb[idx].routeUrl]).then(() => {
          let breadcrumbModel = new BreadcrumbModel([
            [this.breadcrumb[idx].routeName],
            this.breadcrumb[idx].routeUrl,
            1,
          ]);
          breadcrumbModel.update(this.store$);
        });
      }
    }
  }

  closeTab(tab) {
    this.store$.dispatch(new BreadcrumbCancel(tab));
    if (this.breadcrumb.length <= 0) {
      this.router.navigateByUrl('/end');
    }
  }
}
