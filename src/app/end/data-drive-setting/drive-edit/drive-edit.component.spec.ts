/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DriveEditComponent } from './drive-edit.component';

describe('DriveEditComponent', () => {
  let component: DriveEditComponent;
  let fixture: ComponentFixture<DriveEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DriveEditComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriveEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
