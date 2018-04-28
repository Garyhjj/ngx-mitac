/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ResvationTimeComponent } from './resvation-time.component';

describe('ResvationTimeComponent', () => {
  let component: ResvationTimeComponent;
  let fixture: ComponentFixture<ResvationTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResvationTimeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResvationTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
