import { ValidatorFn, AbstractControl } from '@angular/forms';

export function requiredIfValidator(input: AbstractControl, requiredOptions: string[]): ValidatorFn {

  return (control: AbstractControl): {[key: string]: any} | null => {
    if (requiredOptions.includes(input.value) && control.pristine) {
      return {requiredIf: false};
    }
    return null;
  };
}
