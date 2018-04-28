/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QRComponent } from './QR.component';

describe('QRComponent', () => {
  let component: QRComponent;
  let fixture: ComponentFixture<QRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QRComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
