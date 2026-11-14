import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonTimeDistribution } from './comparison-time-distribution';

describe('ComparisonTimeDistribution', () => {
  let component: ComparisonTimeDistribution;
  let fixture: ComponentFixture<ComparisonTimeDistribution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonTimeDistribution],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparisonTimeDistribution);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
