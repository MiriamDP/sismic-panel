import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsSummary } from './metrics-summary';

describe('MetricsSummary', () => {
  let component: MetricsSummary;
  let fixture: ComponentFixture<MetricsSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricsSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricsSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
