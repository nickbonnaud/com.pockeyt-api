import { ValidatorFn, AbstractControl } from '@angular/forms';
export function booleanValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const boolVal: any = control.value;

    if (typeof boolVal !== 'boolean') {
      return { boolean: true };
    }
    return null;
  };
}
