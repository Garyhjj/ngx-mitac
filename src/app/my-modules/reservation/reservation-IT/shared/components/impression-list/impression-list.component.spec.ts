/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ImpressionListComponent } from './impression-list.component';

describe('ImpressionListComponent', () => {
  let component: ImpressionListComponent;
  let fixture: ComponentFixture<ImpressionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImpressionListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpressionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
