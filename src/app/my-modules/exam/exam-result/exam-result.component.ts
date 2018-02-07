import { ExamService } from './../shared/services/exam.service';
import { Component, OnInit } from '@angular/core';
import { DataDrive } from '../../../shared/components/data-drive/shared/models/index';

@Component({
  selector: 'app-exam-result',
  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.css']
})
export class ExamResultComponent implements OnInit {

  dataDrive: DataDrive
  constructor(
    private examService: ExamService
  ) { }

  ngOnInit() {
  }

  getDrive(d: DataDrive) {
    this.dataDrive = d;
    this.alterDriveByRole();
  }

  alterDriveByRole() {
    if(this.examService.role === 2) {
      const selectSet = this.dataDrive.searchSets.find(c => c.InputOpts.type === 'select');
      if(selectSet) {
        const options = selectSet.InputOpts;
        if(options.more && options.more.lazyAPIUserMes) {
          options.more.lazyAPIUserMes.ref_dept = 'DEPTNO';
        }
      }
      this.dataDrive.beforeSearch((d) => {
        return Object.assign(d, {id: 0});
      })
    }
  }

}
