import { UtilService } from './../../../core/services/util.service';
import { eMPIConfig } from './../shared/config/index';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css'],
})
export class ScanComponent implements OnInit {
  testFileUri = '/assets/123.pdf';

  frameSrc: SafeUrl;

  constructor(
    private domSanitizer: DomSanitizer,
    private utilService: UtilService,
  ) {}

  ngOnInit() {
    this.updateFrameSrc(eMPIConfig.viewerUrlBase + this.testFileUri);
  }

  updateFrameSrc(src: string) {
    this.frameSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(src);
  }
}
