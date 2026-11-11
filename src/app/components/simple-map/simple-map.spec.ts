import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleMap } from './simple-map';

describe('SimpleMap', () => {
  let component: SimpleMap;
  let fixture: ComponentFixture<SimpleMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleMap],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
