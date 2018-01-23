import { SearchItemSet } from './../../shared/models/searcher/index';
import { DataDrive, TableDataColumn } from './../../shared/models/index';
import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-data-search',
  templateUrl: './data-search.component.html',
  styleUrls: ['./data-search.component.css']
})
export class DataSearchComponent implements OnInit {

  
  dataDrive: DataDrive;
  columns: TableDataColumn[];
  searchSets: SearchItemSet[];
  columnNameStrings: string[];
  inputTypeList: any[];

  formLayout = 'inline';
  @Input()
  set opts(opts: DataDrive) {
    if (!opts) {
      return;
    }
    this.dataDrive = opts;
    this.searchSets = opts.searchSets;
    this.columns = opts.tableData.columns;
    this.columnNameStrings = this.searchSets.map(s => s.property);
  }
  @Input()
  changeIdx = 1;

  validateForm: FormGroup;

  submitForm() {
    console.log(this.validateForm.value);
  }

  get isHorizontal() {
    return this.formLayout === 'horizontal';
  }



  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    if (!this.dataDrive) {
      return;
    }
    const myForm: any = {};
    this.inputTypeList = this.searchSets.map(s => {
      let def = (s.InputOpts && s.InputOpts.default) || '';
      const mapColumn = this.columns.find(c => c.property === s.property);
      myForm[s.property] = [def];
      return Object.assign({ label: mapColumn?mapColumn.value:s.property }, s.InputOpts);
    });
    console.log(myForm);

    this.validateForm = this.fb.group(myForm);
  }

}
