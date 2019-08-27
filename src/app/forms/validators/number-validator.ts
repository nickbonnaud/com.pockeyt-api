import { ValidatorFn, AbstractControl } from '@angular/forms';
export function numberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const numVal: any = control.value;

    if (typeof numVal !== 'number') {
      return { isNumber: true };
    }
    return null;
  };
}
