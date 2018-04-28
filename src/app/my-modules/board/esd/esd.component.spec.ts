/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EsdComponent } from './esd.component';

describe('EsdComponent', () => {
  let component: EsdComponent;
  let fixture: ComponentFixture<EsdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EsdComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
