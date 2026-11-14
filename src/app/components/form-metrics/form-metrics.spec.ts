import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMetrics } from './form-metrics';

describe('FormMetrics', () => {
  let component: FormMetrics;
  let fixture: ComponentFixture<FormMetrics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMetrics],
    }).compileComponents();

    fixture = TestBed.createComponent(FormMetrics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
