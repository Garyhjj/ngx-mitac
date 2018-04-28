/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DriveListComponent } from './drive-list.component';

describe('DriveListComponent', () => {
  let component: DriveListComponent;
  let fixture: ComponentFixture<DriveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DriveListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
