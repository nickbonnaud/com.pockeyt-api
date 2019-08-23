import { Owner } from './../../models/business/owner';

import { ValidatorFn, AbstractControl } from '@angular/forms';

export function percentOwnValidator(owners: Owner[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let total = 0;
    owners.forEach(owner => {
      total = total + owner.percentOwnership;
    });

    if (total + control.value > 100) {
      return { percentOwn: true };
    }
    return null;
  };
}
