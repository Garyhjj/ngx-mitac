/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InspectionBossReportComponent } from './inspection-boss-report.component';

describe('InspectionBossReportComponent', () => {
  let component: InspectionBossReportComponent;
  let fixture: ComponentFixture<InspectionBossReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InspectionBossReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionBossReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
