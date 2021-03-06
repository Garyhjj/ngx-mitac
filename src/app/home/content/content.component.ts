import { MyStore, BreadcrumbState } from './../../core/store';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent implements OnInit {
  breadcrumb: Observable<BreadcrumbState[]>;
  constructor(private store$: Store<MyStore>) {}

  ngOnInit() {
    this.breadcrumb = this.store$.select((s: MyStore) => s.breadcrumbReducer);
  }
}
