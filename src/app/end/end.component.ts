import { DOCUMENT } from '@angular/platform-browser';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.css'],
})
export class EndComponent implements OnInit {
  isCollapsed;
  private doc: Document;
  constructor(@Inject(DOCUMENT) doc: any, private ref: ChangeDetectorRef) {
    this.doc = doc;
  }

  ngOnInit() {
    if (this.doc.body.clientWidth < 993) {
      this.isCollapsed = true;
    }
    this.ref.detectChanges();
  }
}
