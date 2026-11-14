import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComparison } from './form-comparison';

describe('FormComparison', () => {
  let component: FormComparison;
  let fixture: ComponentFixture<FormComparison>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormComparison],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComparison);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
