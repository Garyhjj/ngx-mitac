import { ProjectService } from './../shared/services/project.service';
import { UtilService } from './../../../core/services/util.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Project } from '../shared/models';
import { isArray } from '../../../shared/utils';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-project-net',
  templateUrl: './project-net.component.html',
  styleUrls: ['./project-net.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNetComponent implements OnInit {
  treeNet;
  empno = this.auth.user.EMPNO;
  hasMeIdArr = [];
  radioValue = 'M';
  storeTree;
  constructor(
    private util: UtilService,
    private projectService: ProjectService,
    private ref: ChangeDetectorRef,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    const dismiss = this.util.showLoading2();
    this.projectService.getAllProject().subscribe(
      (ps: Project[]) => {
        const rawTree = this.getALLRawTree(ps);
        this.hasMeIdArr = this.filterhasMe(rawTree);
        this.storeTree = this.formatTree(rawTree);
        this.switch(this.radioValue);
        this.ref.markForCheck();
        dismiss();
      },
      err => {
        this.util.errDeal(err);
        dismiss();
      },
    );
  }
  switch(v: string) {
    if (v === 'M') {
      this.treeNet = this.storeTree.filter(_ => {
        return this.hasMeIdArr.indexOf(_.title.ID) > -1;
      });
    } else {
      this.treeNet = this.storeTree.slice();
    }
  }
  formatTree(p: Project[]) {
    return p.map(_ => {
      let a: any = {};
      a.title = _;
      a.key = _.ID;
      const children = _.children;
      if (isArray(children) && children.length > 0) {
        a.children = this.formatTree(_.children);
      } else {
        a.children = null;
        a.isLeaf = true;
      }
      return a;
    });
  }
  getALLRawTree(ps: Project[]): Project[] {
    const tree: Project[] = [];
    const getTree = (_ps: Project[], isSecend = false): Project[] => {
      let nArray: Project[] = [];
      let lg = _ps.length;
      while (lg > 0) {
        const a = _ps[lg - 1];
        // 绑定父子关系,并加入下一层的数组中
        const c = _ps.filter(p => p.PARENT_HEADER === a.ID);
        if (c.length > 0) {
          a.children = c;
          nArray.push(a);
        }
        --lg;
      }
      if (nArray.length === 0) {
        const last = isSecend ? _ps : [];
        last.forEach(o => {
          tree.unshift(o);
        });
        return tree;
      } else {
        if (isSecend) {
          // 保存其它小网点
          const others = _ps.filter(p => nArray.indexOf(p) < 0).filter(
            p =>
              !nArray.find(s => {
                return !!s.children.find(c => c.ID === p.ID);
              }),
          );
          others.forEach(o => {
            tree.unshift(o);
          });
        }
        return getTree(nArray, true);
      }
    };
    getTree(ps);
    return tree;
  }

  filterhasMe(ps: Project[]) {
    const empno = this.empno;
    const meInChild = ps.filter(p => p.OWNER !== empno).filter(p => {
      const hasMe = (c: Project) => {
        const children = c.children;
        if (!isArray(children)) {
          return false;
        }
        const has = !!c.children.find(_ => _.OWNER === empno);
        if (has) {
          return has;
        } else {
          if (c.children.length > 0) {
            return c.children.find(_ => hasMe(_));
          } else {
            return false;
          }
        }
      };
      return hasMe(p);
    });
    const meInParent = ps.filter(p => p.OWNER === empno);
    return meInChild.concat(meInParent).map(p => p.ID);
  }
}
