import { Owner } from './../../models/business/owner';

import { ValidatorFn, AbstractControl } from '@angular/forms';

export function primaryOwnerValidator(owners: Owner[]): ValidatorFn {

  return (control: AbstractControl): {[key: string]: any} | null => {
    if (control.value) {
      owners.forEach(owner => {
        if (owner.primary) {
          return { primaryOwner: true };
        }
      });
    }
    return null;
  };

}
