import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricPage } from './historic-page';

describe('HistoricPage', () => {
  let component: HistoricPage;
  let fixture: ComponentFixture<HistoricPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricPage],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
