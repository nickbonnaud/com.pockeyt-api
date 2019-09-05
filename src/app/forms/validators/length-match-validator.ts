import { ValidatorFn, AbstractControl } from '@angular/forms';
export function lengthMatchValidator(validLength: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const str: string = control.value;

    if (str != null && str.length !== validLength) {
      return {lengthMatch: true};
    }
    return null;
  };
}
