import { ValidatorFn, AbstractControl } from '@angular/forms';

export function selectionExistsValidator(options: string[]): ValidatorFn {

  return (control: AbstractControl): {[key: string]: any} | null => {
    if (! options.includes(control.value)) {
      return {selectionExists: true};
    }
    return null;
  };
}
