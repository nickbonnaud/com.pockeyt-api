import { Owner } from './../../models/business/owner';

import { ValidatorFn, AbstractControl } from '@angular/forms';

export function percentOwnValidator(owners: Owner[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let total = 0;
    owners.forEach(owner => {
      const percentOwn: number = typeof owner.percentOwnership === 'string' ? parseInt(owner.percentOwnership) : owner.percentOwnership;
      total = total + percentOwn;
    });

    if (total + parseInt(control.value) > 100) {
      return { percentOwn: true };
    }
    return null;
  };
}
