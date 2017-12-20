import { myStore } from './../core/store';
import { Store } from '@ngrx/store';
import { BreadcrumbModel } from './../core/models/breadcrumb.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.css']
})
export class SiderComponent implements OnInit {

  constructor(
    private store$: Store<myStore>
  ) { }

  ngOnInit() {
    
  }

  select(e:any){
    let target = e.target;
    if(target.nodeName.toLowerCase() === 'li') {
      try{
        let route:string[] = [target.parentNode.parentNode.parentNode.querySelector('div span').innerText, target.innerText];
        let breadcrumbModel = new BreadcrumbModel(route);
        breadcrumbModel.update(this.store$);
      }catch(e) {
        console.log('路由位置獲取失敗');
      }
    }
  }

}
