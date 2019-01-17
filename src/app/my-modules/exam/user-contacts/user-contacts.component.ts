import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../shared/components/data-drive/shared/models';

@Component({
  selector: 'app-user-contacts',
  templateUrl: './user-contacts.component.html',
  styleUrls: ['./user-contacts.component.css'],
})
export class UserContactsComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  getDataDrive(d: DataDrive) {}


}
