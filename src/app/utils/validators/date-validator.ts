
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export const dateRangeValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const start = control.get('start')?.value as Date | null;
  const end = control.get('end')?.value as Date | null;

  if (!start || !end) {
    return null;
  }

  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();

  if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
    return null;
  }

  return startTime > endTime
    ? { invalidDateRange: true }
    : null;
};

export const endDateNotFutureValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const end = control.get('end')?.value as Date | null;

  if (!end) return null;

  const endDay = Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate()
  );

  const today = new Date();

  const todayDay = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return endDay > todayDay
    ? { endDateInFuture: true }
    : null;
};
