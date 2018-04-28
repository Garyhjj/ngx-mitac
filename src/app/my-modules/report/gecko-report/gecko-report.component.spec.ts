import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeckoReportComponent } from './gecko-report.component';

describe('GeckoReportComponent', () => {
  let component: GeckoReportComponent;
  let fixture: ComponentFixture<GeckoReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GeckoReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeckoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
