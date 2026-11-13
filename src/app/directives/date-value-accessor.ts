import { Directive, ElementRef, forwardRef, HostListener, inject, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const DATE_VALUE_PROVIDER: Provider={
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(()=>DateValueAccessorDirective),
  multi: true
}

@Directive({
  selector: 'input([type=date])[formControlName],input([type=date])[formControl],input([type=date])[ngModel]',
  providers:[DATE_VALUE_PROVIDER]
})
export class DateValueAccessorDirective implements ControlValueAccessor{

  constructor(private element: ElementRef<HTMLInputElement>) {}

  private onChange: (value: Date | null) => void = () => {};
  private onTouch: () => void = () => {};

  @HostListener('input', ['$any($event.target).value'])
  handleInput(value: string): void {
    if (!value) {
      this.onChange(null);
      return;
    }

    const [year, month, day] = value.split('-').map(Number);

    // Crear fecha local sin conversiones UTC
    this.onChange(new Date(year, month - 1, day));
  }

  @HostListener('blur')
  handleBlur(): void {
    this.onTouch();
  }

  writeValue(newValue: Date | null): void {

    if (!newValue) {
      this.element.nativeElement.value = '';
      return;
    }

    // Obtener fecha utilizando componentes locales
    const year = newValue.getFullYear();
    const month = String(newValue.getMonth() + 1).padStart(2, '0');
    const day = String(newValue.getDate()).padStart(2, '0');

    this.element.nativeElement.value = `${year}-${month}-${day}`;
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.element.nativeElement.disabled = isDisabled;
  }
  
}
