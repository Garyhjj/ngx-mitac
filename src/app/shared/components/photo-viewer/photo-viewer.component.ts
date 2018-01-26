import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.css']
})
export class PhotoViewerComponent implements OnInit {

  @Input() imgList: any[] = [{
    uid: -1,
    name: 'xxx.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  }];
  @Input() previewImageIdx: number= 0;
  @Input() myShowInformer: Observable<boolean>;
  previewVisible = false;

  constructor() { }

  dismiss() {
    this.previewVisible = false;
  }
  stopPropagation(e:Event) {
    e.stopPropagation()
    return false;
  }
  prev(e:Event) {
    if(this.previewImageIdx === 0) {
      this.previewImageIdx = this.imgList.length -1
    }else {
      --this.previewImageIdx;
    }
    return this.stopPropagation(e);
  }
  next(e:Event) {
    if(this.previewImageIdx === this.imgList.length -1) {
      this.previewImageIdx = 0
    }else {
      ++this.previewImageIdx;
    }
    return this.stopPropagation(e);
  }

  ngOnInit() {
    this.myShowInformer.subscribe(_ => this.previewVisible = true)
  }

}
