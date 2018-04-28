/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InspectionEquipHistoryComponent } from './inspection-equip-history.component';

describe('InspectionEquipHistoryComponent', () => {
  let component: InspectionEquipHistoryComponent;
  let fixture: ComponentFixture<InspectionEquipHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InspectionEquipHistoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionEquipHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
