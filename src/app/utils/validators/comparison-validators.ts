
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

/**
 * Comprueba si una fecha existe en un año determinado.
 */
export function isValidDate(
  day: number,
  month: number,
  year: number
): boolean {

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year) ||
    day < 1 ||
    month < 1 ||
    month > 12
  ) {
    return false;
  }

  const date = new Date(year, month, 0);

  return day <= date.getDate();
}

/**
 * Valida el intervalo de fechas para dos años.
 *
 * Comprueba:
 * - Que los años sean diferentes.
 * - Que la fecha inicial exista en ambos años.
 * - Que la fecha final exista en ambos años.
 * - Que la fecha inicial sea anterior o igual a la final.
 */
export function comparisonDateValidator(
  control: AbstractControl
): ValidationErrors | null {

  const startDay = control.get('startDay')?.value;
  const startMonth = control.get('startMonth')?.value;

  const endDay = control.get('endDay')?.value;
  const endMonth = control.get('endMonth')?.value;

  const firstYear = control.get('firstYear')?.value;
  const secondYear = control.get('secondYear')?.value;

  if (
    !startDay || !startMonth ||
    !endDay || !endMonth ||
    !firstYear || !secondYear
  ) {
    return null;
  }

  // Comprobar que los años sean diferentes
  if (firstYear === secondYear) {
    return { sameYear: true };
  }

  // Comprobar que las fechas existan en ambos años
  const isValidDate = (day: number, month: number, year: number): boolean => {
    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const validStart =
    isValidDate(startDay, startMonth, firstYear) &&
    isValidDate(startDay, startMonth, secondYear);

  const validEnd =
    isValidDate(endDay, endMonth, firstYear) &&
    isValidDate(endDay, endMonth, secondYear);

  if (!validStart || !validEnd) {
    return { invalidLeapDate: true };
  }

  // Comprobar orden del intervalo
  const start = startMonth * 100 + startDay;
  const end = endMonth * 100 + endDay;

  if (start > end) {
    return { invalidDateRange: true };
  }

  return null;
}