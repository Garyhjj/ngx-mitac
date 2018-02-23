import { UtilService } from './../../core/services/util.service';
import { AuthService } from './../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { myStore, UserState, MyModule } from './../../core/store';
import { Store } from '@ngrx/store';
import { BreadcrumbModel } from './../../core/models/breadcrumb.model';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-modules-sider',
  templateUrl: './modules-sider.component.html',
  styleUrls: ['./modules-sider.component.css']
})
export class ModulesSiderComponent implements OnInit,OnDestroy {

  myModules:MyModule[]
  mySub: Subscription;
  @Input()
  isCollapsed;
  constructor(
    private store$: Store<myStore>,
    private router: Router,
    private authService: AuthService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.mySub = this.store$.select(s => s.userReducer).map(u =>u.modules).subscribe(m => this.myModules = m);
  }
  ngOnDestroy() {
    this.mySub && this.mySub.unsubscribe();
  }

  canSeeModule(id) {
    return this.myModules && this.myModules.find(m => m.MODULE_ID === id);
  }
  select(e:any){
    if(!this.authService.checkAuth()) {
      return this.utilService.tokenTimeOut();
    }
    let target = e.target;
    if(target.nodeName.toLowerCase() === 'li') {
      try{
        let top = target.parentNode.parentNode.parentNode
        let route:string[] = [];
        if(top.className === 'ant-menu-item-group') {
          route.push(top.querySelector('div span').innerText);
          route = route.concat([top.parentNode.parentNode.parentNode.querySelector('div span').innerText, target.innerText])
        }else {
          route = [top.querySelector('div span').innerText, target.innerText];
        }
        let breadcrumbModel = new BreadcrumbModel(route);
        breadcrumbModel.update(this.store$);
        let navRoute;
        if( navRoute = target.dataset.route) {
          this.router.navigate([navRoute]);
        }
      }catch(e) {
        console.log('路由位置獲取失敗');
      }
    }
  }

}
