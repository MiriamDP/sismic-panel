import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonSummary } from './comparison-summary';

describe('ComparisonSummary', () => {
  let component: ComparisonSummary;
  let fixture: ComponentFixture<ComparisonSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparisonSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
