import { ValidatorFn, AbstractControl } from "@angular/forms";

export function passwordMatchValidator(password): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    console.log(password);
    if (password === control.value) {
      return { match: true };
    }
    return null;
  };
}
