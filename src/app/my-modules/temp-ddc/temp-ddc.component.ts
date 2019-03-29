import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../shared/components/data-drive/shared/models';

@Component({
  selector: 'app-temp-ddc',
  templateUrl: './temp-ddc.component.html',
  styleUrls: ['./temp-ddc.component.css'],
})
export class TempDDCComponent implements OnInit {
  id: number;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
      console.log(this.id)
    });
  }

  getDataDrive(d: DataDrive) {}


}
