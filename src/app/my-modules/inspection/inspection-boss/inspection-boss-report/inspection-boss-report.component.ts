import { InspectionBossService } from './../shared/services/inspection-boss.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inspection-boss-report',
  templateUrl: './inspection-boss-report.component.html',
  styleUrls: ['./inspection-boss-report.component.css']
})
export class InspectionBossReportComponent implements OnInit {

  constructor(private inspectionBossService: InspectionBossService) { }

  ngOnInit() {
    this.inspectionBossService.getEmployeeSchedule().subscribe(c => console.log(c))
  }

}
