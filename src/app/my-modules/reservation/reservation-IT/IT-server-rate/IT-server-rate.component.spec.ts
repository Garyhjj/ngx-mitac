/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ITServerRateComponent } from './IT-server-rate.component';

describe('ITServerRateComponent', () => {
  let component: ITServerRateComponent;
  let fixture: ComponentFixture<ITServerRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ITServerRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ITServerRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
