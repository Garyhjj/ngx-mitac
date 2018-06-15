import { DOCUMENT } from '@angular/platform-browser';
import { AuthService } from './core/services/auth.service';
import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  doc: Document;
  constructor(
    private auth: AuthService,
    private translate: TranslateService,
    @Inject(DOCUMENT) doc: any,
    private render: Renderer2,
  ) {
    this.translate.addLangs(['zh-tw', 'en', 'zh-cn']);
    // let broswerLang = translate.getBrowserLang();
    // translate.use(broswerLang.match('en') ? broswerLang : 'zh-TW');
    let broswerLang = window.navigator.language.toLowerCase();
    translate.use(broswerLang);
    this.doc = doc;
    // translate.use('zh-cn');
  }

  ngOnInit() {
    try {
      this.render.setStyle(
        this.doc.querySelector('#cdk-overlay-0'),
        'zIndex',
        100000,
      );
    } catch (e) {}
  }
}
