import { BreadcrumbCancel } from './../../core/actions/breadcrumb.action';
import { MyStore, BreadcrumbState } from './../../core/store';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import {
  FormBuilder,
  FormGroup,
  FormControl
} from '@angular/forms';

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
    private store$: Store<MyStore>,
    private router: Router,
    private fb: FormBuilder
  ) { }

  show = false;
  title = 'app';
  isCollapsed = false;

  isOpenOne = true;
  isOpenTwo = false;
  isOpenThree = false;

  _dataSet = [];
  _bordered = true;
  _loading = false;
  _pagination = true;
  _header = true;
  _title = false;
  _footer = false;
  _fixHeader = false;
  _size = 'default';

  // 高级搜索框
  validateForm: FormGroup;
  controlArray = [];
  isCollapse = true;

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
    console.log(this.isCollapse);
    // this.controlArray.forEach((c, index) => {
    //   c.show = this.isCollapse ? (index < 6) : true;
    // });
  }

  toggle() {
    this.show = !this.show;
  }
  resetForm() {
    this.validateForm.reset();
  }

  ngOnInit() {
    this.sub = this.store$.select((s: MyStore) => s.breadcrumbReducer).subscribe((b) => {
      this.breadcrumb = b;
      const idx = b.findIndex(r => r.active);
      this.tabIdx = idx > -1 ? idx : b.length - 1;
    });

    for (let i = 1; i <= 10; i++) {
      this._dataSet.push({
        key: i,
        name: 'John Brown',
        age: `${i}2`,
        address: `New York No. ${i} Lake Park`,
        description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
      });
    }

    this.validateForm = this.fb.group({});

    for (let i = 0; i < 3; i++) {
      this.controlArray.push({ index: i, show: true });
      this.validateForm.addControl(`field${i}`, new FormControl());
    }
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
