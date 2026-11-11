import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportStatus } from './import-status';

describe('ImportStatus', () => {
  let component: ImportStatus;
  let fixture: ComponentFixture<ImportStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
