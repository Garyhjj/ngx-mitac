import { ExamService } from './../shared/services/exam.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../shared/components/data-drive/shared/models/index';
import { AuthService } from '../../../core/services/auth.service';
import { isArray } from '../../../shared/utils/index';

@Component({
  selector: 'app-exam-result',
  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.css']
})
export class ExamResultComponent implements OnInit {

  dataDrive: DataDrive;
  user = this.auth.user;
  constructor(
    private examService: ExamService,
    private auth: AuthService
  ) { }

  ngOnInit() {
  }

  getDrive(d: DataDrive) {
    this.dataDrive = d;
    this.alterDriveByRole();
  }

  alterDriveByRole() {
    if (this.examService.role === 2) {
      this.dataDrive.beforeInitTableData(data => {
        if (isArray(data)) {
          return data.filter(d => d.ASSISTANT === this.auth.user.EMPNO);
        }
      });
    }
  }

}
