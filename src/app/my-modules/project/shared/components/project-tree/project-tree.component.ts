import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NzTreeNode } from 'ng-zorro-antd';

@Component({
  selector: 'app-project-tree',
  templateUrl: './project-tree.component.html',
  styleUrls: ['./project-tree.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectTreeComponent implements OnInit {
  @Input()
  set tree(t) {
    this.nodes = [new NzTreeNode(t)];
  }
  @Input() expandDefault = true;
  @Input() isInModal = false;
  nodes;

  ngOnInit(): void {}

  getRate(c) {
    const finish = c.filter(l => l.title.STATUS === 'Closed');
    return ((finish.length / c.length) * 100).toFixed(0);
  }
}
