import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { dateRangeValidator, endDateNotFutureValidator } from '../../utils/validators/date-validator';
import { DateValueAccessorDirective } from '../../directives/date-value-accessor';
import { ImportJob, ImportJobRequest } from '../../interfaces/import-job';

@Component({
  selector: 'app-import-form',
  imports: [ReactiveFormsModule, DateValueAccessorDirective],
  templateUrl: './import-form.html',
  styleUrl: './import-form.css',
})
export class ImportForm {
  private fb = inject(FormBuilder);
  formValue =output<ImportJobRequest>();

  form = this.fb.group({
    start: [<Date | null>null, Validators.required],
    end: [<Date | null>null, Validators.required],
    mag: [0, [Validators.min(-2), Validators.max(10)]]
  }, {
    validators: [
      dateRangeValidator,
      endDateNotFutureValidator
    ]
  })

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    this.formValue.emit(formValue)

    console.log(formValue);

  }
}
