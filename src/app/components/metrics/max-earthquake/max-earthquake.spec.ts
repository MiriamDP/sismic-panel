import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxEarthquake } from './max-earthquake';

describe('MaxEarthquake', () => {
  let component: MaxEarthquake;
  let fixture: ComponentFixture<MaxEarthquake>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaxEarthquake],
    }).compileComponents();

    fixture = TestBed.createComponent(MaxEarthquake);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
