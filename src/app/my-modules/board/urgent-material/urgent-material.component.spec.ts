/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UrgentMaterialComponent } from './urgent-material.component';

describe('UrgentMaterialComponent', () => {
  let component: UrgentMaterialComponent;
  let fixture: ComponentFixture<UrgentMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UrgentMaterialComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgentMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
