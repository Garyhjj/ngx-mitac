/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InspectionBossScheduleComponent } from './inspection-boss-schedule.component';

describe('InspectionBossScheduleComponent', () => {
  let component: InspectionBossScheduleComponent;
  let fixture: ComponentFixture<InspectionBossScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InspectionBossScheduleComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionBossScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
