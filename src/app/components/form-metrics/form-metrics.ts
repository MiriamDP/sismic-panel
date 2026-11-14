import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { dateRangeValidator, endDateNotFutureValidator } from '../../utils/validators/date-validator';
import { DateValueAccessorDirective } from '../../directives/date-value-accessor';
import { EarthquakeFilters } from '../../interfaces/earthquake';
import { CountryService } from '../../services/country-service';

@Component({
  selector: 'app-form-metrics',
  imports: [ReactiveFormsModule, DateValueAccessorDirective],
  templateUrl: './form-metrics.html',
  styleUrl: './form-metrics.css',
})
export class FormMetrics {
  private fb = inject(FormBuilder);
  form=output<Partial<EarthquakeFilters>>()
  filters = input<Partial<EarthquakeFilters> | null>(null);

  private countrySvc = inject(CountryService);

  countries = this.countrySvc.countries;

  constructor() {
    effect(() => {
      const filters = this.filters();

      if (!filters) return;

      this.analysisForm.patchValue({
        countryCode: filters.countryCode ?? '',

        minMagnitude: filters.minMagnitude ?? null,
        maxMagnitude: filters.maxMagnitude ?? null,

      startDate: this.parseDate(filters.startDate),
      endDate: this.parseDate(filters.endDate),

        minDepth: filters.minDepth ?? null,
        maxDepth: filters.maxDepth ?? null
      });
    });
  }

  analysisForm = this.fb.group({
    countryCode: '',

    minMagnitude: [0,[Validators.min(0),Validators.max(10)]],
    maxMagnitude: [0,[Validators.min(0),Validators.max(10)]],

    startDate: [new Date(), Validators.required],
    endDate: [new Date(), Validators.required],

    minDepth: [0,[Validators.min(0),Validators.max(10)]],
    maxDepth: [0,[Validators.min(0),Validators.max(10)]],

  }, {
    validators: [
      dateRangeValidator,
      endDateNotFutureValidator
    ]
  });

  analyzing = false;

  analysisData: any = null;

  analyzeEarthquakes() {

  if (this.analysisForm.invalid) {
    this.analysisForm.markAllAsTouched();
    return;
  }

  const values = this.analysisForm.getRawValue();

  const filters: Partial<EarthquakeFilters> = {

    countryCode: values.countryCode || null,

    minMagnitude: values.minMagnitude || null,
    maxMagnitude: values.maxMagnitude || null,

    startDate: this.formatDate(values.startDate),
    endDate: this.formatDate(values.endDate),

    minDepth: values.minDepth || null,
    maxDepth: values.maxDepth || null

  };

  this.form.emit(filters);

  }


  clearAnalysisFilters() {
    this.analysisForm.reset({
      countryCode: null,
      minMagnitude: null,
      maxMagnitude: null,
      startDate: new Date(),
      endDate: new Date(),
      minDepth: null,
      maxDepth: null
    });
  }

  private formatDate(date: Date | null): string | null {
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

private parseDate(date: string | null | undefined): Date {
  if (!date) return new Date();

  const [year, month, day] = date.split('-').map(Number);

  return new Date(year, month - 1, day);
}
}
