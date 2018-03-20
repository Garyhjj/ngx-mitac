/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SelfApplicationITComponent } from './self-application-IT.component';

describe('SelfApplicationITComponent', () => {
  let component: SelfApplicationITComponent;
  let fixture: ComponentFixture<SelfApplicationITComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfApplicationITComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfApplicationITComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
