/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ITServerTrackComponent } from './IT-server-track.component';

describe('ITServerTrackComponent', () => {
  let component: ITServerTrackComponent;
  let fixture: ComponentFixture<ITServerTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ITServerTrackComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ITServerTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
