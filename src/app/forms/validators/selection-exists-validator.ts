import { ValidatorFn, AbstractControl } from '@angular/forms';
import { STATE_OPTIONS } from 'src/assets/data/states-select';

export function selectionExistsValidator(options: string[]): ValidatorFn {

  return (control: AbstractControl): {[key: string]: any} | null => {
    if (! options.includes(control.value)) {
      return {selectionExists: false};
    }
    return null;
  };
}
