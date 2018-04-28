/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InspectionBossLinesComponent } from './inspection-boss-lines.component';

describe('InspectionBossLinesComponent', () => {
  let component: InspectionBossLinesComponent;
  let fixture: ComponentFixture<InspectionBossLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InspectionBossLinesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionBossLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
