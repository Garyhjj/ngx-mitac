import { myStore } from './../core/store';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  
  constructor(
    private store$: Store<myStore>
  ) { }

  ngOnInit() {
  }

}
