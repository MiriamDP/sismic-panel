import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EarthquakeComparisonFilters } from '../../interfaces/earthquake';
import { comparisonDateValidator } from '../../utils/validators/comparison-validators';
import { CountryService } from '../../services/country-service';

@Component({
  selector: 'app-form-comparison',
  imports: [ReactiveFormsModule],
  templateUrl: './form-comparison.html',
  styleUrl: './form-comparison.css',
})
export class FormComparison {
  filters = input<Partial<EarthquakeComparisonFilters>>({});

  form = output<Partial<EarthquakeComparisonFilters>>();

  private countrySvc = inject(CountryService);

countries = this.countrySvc.countries;

  private fb = new FormBuilder();

  comparisonForm = this.fb.group({
    startDay: [1, [Validators.required, Validators.min(1), Validators.max(31)]],
    startMonth: [1, [Validators.required, Validators.min(1), Validators.max(12)]],

    endDay: [31, [Validators.required, Validators.min(1), Validators.max(31)]],
    endMonth: [12, [Validators.required, Validators.min(1), Validators.max(12)]],

    firstYear: [2024, [Validators.required, Validators.min(1900)]],
    secondYear: [2025, [Validators.required, Validators.min(1900)]],

    countryCode: [null as string | null],

    minMagnitude: [null as number | null],
    maxMagnitude: [null as number | null],

    minDepth: [null as number | null],
    maxDepth: [null as number | null],
  }, {
    validators: comparisonDateValidator
  });

  months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  constructor() {

    effect(() => {
      const currentFilters = this.filters();

      this.comparisonForm.patchValue(currentFilters);
    });

  }

onSubmit(): void {

  if (this.comparisonForm.invalid) {
    this.comparisonForm.markAllAsTouched();
    return;
  }

  const filters = this.comparisonForm.getRawValue();

  this.form.emit({
    ...filters,
    startDay: filters.startDay!,
    startMonth: filters.startMonth!,
    endDay: filters.endDay!,
    endMonth: filters.endMonth!,
    firstYear: filters.firstYear!,
    secondYear: filters.secondYear!
  });

}

  reset(): void {

    this.comparisonForm.reset({
      startDay: 1,
      startMonth: 1,
      endDay: 31,
      endMonth: 12,

      firstYear: 2024,
      secondYear: 2025,

      countryCode: null,

      minMagnitude: null,
      maxMagnitude: null,

      minDepth: null,
      maxDepth: null
    });

    this.onSubmit();
  }
}
