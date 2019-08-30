import { ValidatorFn, AbstractControl } from '@angular/forms';

export function requiredFileType(acceptedTypes: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const types: string[] = acceptedTypes.map(t => t.toLowerCase());
    const file: File = control.value;
    if (file) {
      const extension = file.name.split('.')[1].toLowerCase();
      if (!types.includes(extension)) {
        return { requiredFileType: true };
      }
      return null;
    }
    return null;
  };
}
