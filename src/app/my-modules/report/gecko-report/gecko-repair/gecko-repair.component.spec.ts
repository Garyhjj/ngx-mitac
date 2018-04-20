import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeckoRepairComponent } from './gecko-repair.component';

describe('GeckoRepairComponent', () => {
  let component: GeckoRepairComponent;
  let fixture: ComponentFixture<GeckoRepairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeckoRepairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeckoRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
