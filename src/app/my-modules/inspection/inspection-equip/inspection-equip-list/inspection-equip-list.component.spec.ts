/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InspectionEquipListComponent } from './inspection-equip-list.component';

describe('InspectionEquipListComponent', () => {
  let component: InspectionEquipListComponent;
  let fixture: ComponentFixture<InspectionEquipListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InspectionEquipListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionEquipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
