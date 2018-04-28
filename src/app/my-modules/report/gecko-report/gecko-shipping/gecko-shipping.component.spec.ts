import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeckoShippingComponent } from './gecko-shipping.component';

describe('GeckoShippingComponent', () => {
  let component: GeckoShippingComponent;
  let fixture: ComponentFixture<GeckoShippingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GeckoShippingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeckoShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
