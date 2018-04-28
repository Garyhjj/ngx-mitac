import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OspComponent } from './osp.component';

describe('OspComponent', () => {
  let component: OspComponent;
  let fixture: ComponentFixture<OspComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OspComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
