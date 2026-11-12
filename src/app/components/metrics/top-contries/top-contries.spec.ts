import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopContries } from './top-contries';

describe('TopContries', () => {
  let component: TopContries;
  let fixture: ComponentFixture<TopContries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopContries],
    }).compileComponents();

    fixture = TestBed.createComponent(TopContries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
