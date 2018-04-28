import { Observable } from 'rxjs/Observable';
import { ReservationITService } from './../../services/reservaton-IT.service';
import { UtilService } from './../../../../../../core/services/util.service';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ReservationApplication } from '../../models';

@Component({
  selector: 'app-impression-list',
  templateUrl: './impression-list.component.html',
  styleUrls: ['./impression-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImpressionListComponent implements OnInit {
  @Input()
  set application(app: ReservationApplication) {
    this.impressionList = [];
    this.impressionSelected = {};
    const loadingID = this.util.showLoading();
    const final = () => this.util.dismissLoading(loadingID);
    Observable.forkJoin(
      this.reservationITService.getPersonImpression(app.HANDLER),
      this.reservationITService.getServiceImpressionResults(app.ID),
    ).subscribe(
      (res: any[]) => {
        final();
        this.impressionList = res[0];
        if (Array.isArray(res[1])) {
          res[1].forEach(
            r => (this.impressionSelected[r.IMPRESSION_ID] = true),
          );
        }
        this.ref.markForCheck();
      },
      err => {
        final();
        this.util.errDeal(err);
      },
    );
  }
  impressionList: any[];
  impressionSelected: any = {};
  constructor(
    private util: UtilService,
    private reservationITService: ReservationITService,
    private ref: ChangeDetectorRef,
  ) {}

  ngOnInit() {}
}
