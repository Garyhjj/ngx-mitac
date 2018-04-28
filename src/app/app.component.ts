import { AuthService } from './core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService, private translate: TranslateService) {
    this.translate.addLangs(['zh-tw', 'en', 'zh-cn']);
    // let broswerLang = translate.getBrowserLang();
    // translate.use(broswerLang.match('en') ? broswerLang : 'zh-TW');
    let broswerLang = window.navigator.language.toLowerCase();
    translate.use(broswerLang);
    // translate.use('zh-cn');
  }

  ngOnInit() {}
}
