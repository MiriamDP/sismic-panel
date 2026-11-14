import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportForm } from './import-form';

describe('ImportForm', () => {
  let component: ImportForm;
  let fixture: ComponentFixture<ImportForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
