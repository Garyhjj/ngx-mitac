/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UrgentNoComponent } from './urgent-no.component';

describe('UrgentNoComponent', () => {
  let component: UrgentNoComponent;
  let fixture: ComponentFixture<UrgentNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UrgentNoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgentNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
