import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeckoRmaComponent } from './gecko-rma.component';

describe('GeckoRmaComponent', () => {
  let component: GeckoRmaComponent;
  let fixture: ComponentFixture<GeckoRmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GeckoRmaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeckoRmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
