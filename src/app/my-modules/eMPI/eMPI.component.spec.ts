/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EMPIComponent } from './eMPI.component';

describe('EMPIComponent', () => {
  let component: EMPIComponent;
  let fixture: ComponentFixture<EMPIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EMPIComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EMPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
