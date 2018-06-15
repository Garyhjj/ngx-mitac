import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataDrive } from '../../../shared/components/data-drive/shared/models/index';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exam-question',
  templateUrl: './exam-question.component.html',
  styleUrls: ['./exam-question.component.css'],
})
export class ExamQuestionComponent implements OnInit, OnDestroy {
  dataDrive: DataDrive;
  translateTexts: any;
  sub: Subscription;
  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    this.sub = this.translateService
      .stream([
        'examModule.radioHasOnlyAnswer',
        'examModule.trueOrFalseWaining',
        'examModule.choiceBoxWaining',
        'examModule.answerRequired',
      ])
      .subscribe(_ => (this.translateTexts = _));
  }
  ngOnDestroy() {
    if (this.sub instanceof Subscription) {
      this.sub.unsubscribe();
    }
  }

  getDrive(d: DataDrive) {
    this.dataDrive = d;
    this.editUpdateFormGroup();
    this.beforeUpdate();
  }

  editUpdateFormGroup() {
    this.dataDrive.onUpdateFormShow((fg, sub) => {
      const errReset = () => sub.next('');
      fg.get('TYPE').valueChanges.subscribe(d => {
        if (d === 'TF') {
          fg.get('RIGHT_ANSWER').setValue('Y');
        } else if (d === 'RADIO') {
          if (fg.get('RIGHT_ANSWER').value.indexOf(',') > -1) {
            sub.next(this.translateTexts['examModule.radioHasOnlyAnswer']);
          } else {
            errReset();
          }
        } else {
          errReset();
        }
      });

      fg.get('RIGHT_ANSWER').valueChanges.subscribe(d => {
        if (d && fg.get('TYPE').value === 'RADIO') {
          const res = d.split(',');
          if (res.length > 1) {
            sub.next(this.translateTexts['examModule.radioHasOnlyAnswer']);
          } else {
            errReset();
          }
        } else {
          errReset();
        }
      });
    });
  }

  beforeUpdate() {
    this.dataDrive.beforeUpdateSubmit((fg, sub) => {
      const value = fg.value;
      setTimeout(() => sub.next(''), 2000);
      if (value.TYPE === 'TF') {
        try {
          const options = [
            'OPTION_A',
            'OPTION_B',
            'OPTION_C',
            'OPTION_D',
            'OPTION_E',
          ];
          options.forEach(o => fg.get(o).setValue(''));
        } catch (e) {}
        if (['Y', 'N'].indexOf(value['RIGHT_ANSWER']) < 0) {
          sub.next(this.translateTexts['examModule.trueOrFalseWaining']);
          return false;
        }
      } else if (value.TYPE === 'RADIO') {
        if (!value['OPTION_A'] || !value['OPTION_B']) {
          sub.next(this.translateTexts['examModule.choiceBoxWaining']);
          return false;
        }
        if (!value['OPTION_' + value['RIGHT_ANSWER']]) {
          sub.next(this.translateTexts['examModule.answerRequired']);
          return false;
        }
      } else if (value.TYPE === 'CHECKBOX') {
        if (!value['OPTION_A'] || !value['OPTION_B']) {
          sub.next(this.translateTexts['examModule.choiceBoxWaining']);
          return false;
        }
        const answers = value['RIGHT_ANSWER'].split(',');
        let isOk = true;
        answers.forEach(a => {
          if (!value['OPTION_' + a]) {
            isOk = false;
          }
        });
        if (!isOk) {
          sub.next(this.translateTexts['examModule.answerRequired']);
          return false;
        }
      }
      sub.next('');
      return true;
    });
  }
}
