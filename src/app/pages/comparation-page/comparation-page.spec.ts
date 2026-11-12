import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparationPage } from './comparation-page';

describe('ComparationPage', () => {
  let component: ComparationPage;
  let fixture: ComponentFixture<ComparationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparationPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparationPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
