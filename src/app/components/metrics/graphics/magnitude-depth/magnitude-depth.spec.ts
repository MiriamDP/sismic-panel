import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagnitudeDepth } from './magnitude-depth';

describe('MagnitudeDepth', () => {
  let component: MagnitudeDepth;
  let fixture: ComponentFixture<MagnitudeDepth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagnitudeDepth],
    }).compileComponents();

    fixture = TestBed.createComponent(MagnitudeDepth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
