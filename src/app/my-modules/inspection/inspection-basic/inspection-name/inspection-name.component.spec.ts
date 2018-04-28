/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InspectionNameComponent } from './inspection-name.component';

describe('InspectionNameComponent', () => {
  let component: InspectionNameComponent;
  let fixture: ComponentFixture<InspectionNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InspectionNameComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
