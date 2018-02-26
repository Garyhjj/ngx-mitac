import { UtilService } from './../../core/services/util.service';
import { AuthService } from './../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { myStore, UserState, MyModule, Privilege } from './../../core/store';
import { Store } from '@ngrx/store';
import { BreadcrumbModel } from './../../core/models/breadcrumb.model';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-end-sider',
  templateUrl: './end-sider.component.html',
  styleUrls: ['./end-sider.component.css']
})
export class EndSiderComponent implements OnInit,OnDestroy {

  myModules:MyModule[]
  mySub: Subscription;
  myPrivilege: Privilege[];
  @Input()
  isCollapsed;
  constructor(
    private store$: Store<myStore>,
    private router: Router,
    private authService: AuthService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.mySub = this.store$.select(s => s.userReducer).subscribe(u => {this.myModules = u.modules; this.myPrivilege = u.privilege});
    let breadcrumbModel = new BreadcrumbModel(['後台']);
    breadcrumbModel.update(this.store$);
  }
  ngOnDestroy() {
    this.mySub && this.mySub.unsubscribe();
  }

  canSeeModule(id) {
    return this.myModules && this.myModules.find(m => m.MODULE_ID === id);
  }

  canSeeFunction(id) {
    return this.myPrivilege && this.myPrivilege.find(m => m.FUNCTION_ID === id);
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
        route.unshift('後台')
        let breadcrumbModel = new BreadcrumbModel(route);
        breadcrumbModel.update(this.store$);
        let navRoute;
        if( navRoute = target.dataset.route) {
          this.router.navigate(['end/' + navRoute]);
        }
      }catch(e) {
        console.log('路由位置獲取失敗');
      }
    }
  }

}
