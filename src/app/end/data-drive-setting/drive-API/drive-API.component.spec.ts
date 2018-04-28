/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DriveAPIComponent } from './drive-API.component';

describe('DriveAPIComponent', () => {
  let component: DriveAPIComponent;
  let fixture: ComponentFixture<DriveAPIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DriveAPIComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriveAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
