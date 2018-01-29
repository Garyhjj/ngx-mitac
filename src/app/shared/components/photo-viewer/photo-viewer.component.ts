import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.css']
})
export class PhotoViewerComponent implements OnInit, OnDestroy {

  @Input() imgList: any[] = [];
  _previewImageIdx = 0;
  @Input()
  set previewImageIdx(idx: number) {
    if (Number.isInteger(idx) && idx > -1) {
      this._previewImageIdx = idx;
    }
  };
  @Input() myShowInformer: Observable<boolean>;
  mySub: Subscription;
  previewVisible = false;

  constructor() { }

  dismiss() {
    this.previewVisible = false;
  }
  stopPropagation(e: Event) {
    e.stopPropagation()
    return false;
  }
  prev(e: Event) {
    if (this._previewImageIdx === 0) {
      this._previewImageIdx = this.imgList.length - 1
    } else {
      --this.previewImageIdx;
    }
    return this.stopPropagation(e);
  }
  next(e: Event) {
    if (this._previewImageIdx === this.imgList.length - 1) {
      this._previewImageIdx = 0
    } else {
      ++this._previewImageIdx;
    }
    return this.stopPropagation(e);
  }

  ngOnInit() {
    if (this.myShowInformer instanceof Observable) {
      this.mySub = this.myShowInformer.subscribe(_ => this.previewVisible = true)
    }
  }

  ngOnDestroy() {
    if (this.mySub instanceof Subscription) {
      this.mySub.unsubscribe();
    }
  }

}
