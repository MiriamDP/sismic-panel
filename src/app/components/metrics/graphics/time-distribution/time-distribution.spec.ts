import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeDistribution } from './time-distribution';

describe('TimeDistribution', () => {
  let component: TimeDistribution;
  let fixture: ComponentFixture<TimeDistribution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeDistribution],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeDistribution);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
