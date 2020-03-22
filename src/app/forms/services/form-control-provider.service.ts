import { POS_TYPES } from 'src/assets/data/pos-types';
import { AppFormsModule } from './../app-forms.module';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';
import { patterns } from '../validators/patterns';
import { STATE_OPTIONS } from 'src/assets/data/states-select';
import { selectionExistsValidator } from '../validators/selection-exists-validator';
import { lengthMatchValidator } from '../validators/length-match-validator';
import { ENTITY_TYPE_OPTIONS } from 'src/assets/data/entity-types-select';
import { Owner } from 'src/app/models/business/owner';
import { booleanValidator } from '../validators/boolean-validator';
import { primaryOwnerValidator } from '../validators/primary-owner-validator';
import { numberValidator } from '../validators/number-validator';
import { percentOwnValidator } from '../validators/percent-own-validator';
import { requiredFileType } from '../validators/required-file-type';
import { PosType } from 'src/app/models/other-data/pos-type';

@Injectable({
  providedIn: AppFormsModule
})
export class FormControlProviderService {
  constructor(private fb: FormBuilder) {}

  registerProfileControls(): FormGroup {
    return this.fb.group({
      name: [
        "",
        Validators.compose([Validators.required, Validators.minLength(2)])
      ],
      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(25)])
      ],
      phone: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.numbers_only),
          lengthMatchValidator(10)
        ])
      ],
      website: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.website)
        ])
      ],
      googlePlaceId: [""]
    });
  }

  registerMapControls(radius: number = null): FormGroup {
    return this.fb.group({
      radius: [
        radius == null ? 50 : radius,
        Validators.compose([
          Validators.required,
          Validators.max(200),
          Validators.min(50),
          numberValidator
        ])
      ],
      lat: ["", Validators.compose([Validators.required])],
      lng: ["", Validators.compose([Validators.required])]
    });
  }

  registerPosTypeControls(): FormGroup {
    return this.fb.group({
      type: [
        "",
        Validators.compose([
          Validators.required,
          selectionExistsValidator(this.posTypesToArray())
        ])
      ],
      takesTips: [
        "",
        Validators.compose([Validators.required, booleanValidator])
      ],
      allowsOpenTickets: [
        "",
        Validators.compose([Validators.required, booleanValidator])
      ]
    });
  }

  registerBusinessControls(): FormGroup {
    const states: string[] = STATE_OPTIONS;

    return this.fb.group({
      businessName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(2)])
      ],
      address: ["", Validators.compose([Validators.required])],
      addressSecondary: [""],
      city: ["", Validators.compose([Validators.required])],
      state: [
        "",
        Validators.compose([
          Validators.required,
          selectionExistsValidator(states)
        ])
      ],
      zip: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.numbers_only),
          lengthMatchValidator(5)
        ])
      ],
      entityType: [
        "",
        Validators.compose([
          Validators.required,
          selectionExistsValidator(this.entityTypesToArray())
        ])
      ],
      ein: [
        "",
        Validators.compose([
          Validators.pattern(patterns.numbers_only),
          lengthMatchValidator(9)
        ])
      ]
    });
  }

  registerOwnerControls(owners: Owner[]): FormGroup {
    const states: string[] = STATE_OPTIONS;

    return this.fb.group({
      firstName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.letters_dashes_spaces)
        ])
      ],
      lastName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.letters_dashes_spaces)
        ])
      ],
      title: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.letters_dashes_spaces)
        ])
      ],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      phone: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.numbers_only),
          lengthMatchValidator(10)
        ])
      ],
      dob: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.date)
        ])
      ],
      ssn: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.numbers_only),
          lengthMatchValidator(9)
        ])
      ],
      address: ["", Validators.compose([Validators.required])],
      addressSecondary: [""],
      city: ["", Validators.compose([Validators.required])],
      state: [
        "",
        Validators.compose([
          Validators.required,
          selectionExistsValidator(states)
        ])
      ],
      zip: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.numbers_only),
          lengthMatchValidator(5)
        ])
      ],
      primary: [
        "",
        Validators.compose([
          Validators.required,
          booleanValidator,
          primaryOwnerValidator(owners)
        ])
      ],
      percentOwnership: [
        "",
        Validators.compose([
          Validators.required,
          numberValidator,
          percentOwnValidator(owners)
        ])
      ]
    });
  }

  updateOwnerControls(owners: Owner[]): FormGroup {
    const states: string[] = STATE_OPTIONS;

    return this.fb.group({
      firstName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.letters_dashes_spaces)
        ])
      ],
      lastName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.letters_dashes_spaces)
        ])
      ],
      title: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.letters_dashes_spaces)
        ])
      ],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      phone: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.numbers_only),
          lengthMatchValidator(10)
        ])
      ],
      dob: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.date)
        ])
      ],
      ssn: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.masked),
          lengthMatchValidator(9)
        ])
      ],
      address: ["", Validators.compose([Validators.required])],
      addressSecondary: [""],
      city: ["", Validators.compose([Validators.required])],
      state: [
        "",
        Validators.compose([
          Validators.required,
          selectionExistsValidator(states)
        ])
      ],
      zip: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.numbers_only),
          lengthMatchValidator(5)
        ])
      ],
      primary: [
        "",
        Validators.compose([
          Validators.required,
          booleanValidator,
          primaryOwnerValidator(owners)
        ])
      ],
      percentOwnership: [""]
    });
  }

  registerBankControls(): FormGroup {
    const states: string[] = STATE_OPTIONS;
    const typeOptions: string[] = ["checking", "savings"];

    return this.fb.group({
      firstName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.letters_dashes_spaces)
        ])
      ],
      lastName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.letters_dashes_spaces)
        ])
      ],
      address: ["", Validators.compose([Validators.required])],
      addressSecondary: [""],
      city: ["", Validators.compose([Validators.required])],
      state: [
        "",
        Validators.compose([
          Validators.required,
          selectionExistsValidator(states)
        ])
      ],
      zip: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.numbers_only),
          lengthMatchValidator(5)
        ])
      ],
      routingNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.numbers_only),
          lengthMatchValidator(9)
        ])
      ],
      accountNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.numbers_only),
          Validators.minLength(6),
          Validators.maxLength(17)
        ])
      ],
      accountType: [
        "",
        Validators.compose([
          Validators.required,
          selectionExistsValidator(typeOptions)
        ])
      ]
    });
  }

  UpdateBankControls(): FormGroup {
    const states: string[] = STATE_OPTIONS;
    const typeOptions: string[] = ["checking", "savings"];

    return this.fb.group({
      firstName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.letters_dashes_spaces)
        ])
      ],
      lastName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.letters_dashes_spaces)
        ])
      ],
      address: ["", Validators.compose([Validators.required])],
      addressSecondary: [""],
      city: ["", Validators.compose([Validators.required])],
      state: [
        "",
        Validators.compose([
          Validators.required,
          selectionExistsValidator(states)
        ])
      ],
      zip: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.numbers_only),
          lengthMatchValidator(5)
        ])
      ],
      routingNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.masked),
          lengthMatchValidator(9)
        ])
      ],
      accountNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.masked),
          Validators.minLength(6),
          Validators.maxLength(17)
        ])
      ],
      accountType: [
        "",
        Validators.compose([
          Validators.required,
          selectionExistsValidator(typeOptions)
        ])
      ]
    });
  }

  registerPhotosControls(): FormGroup {
    return this.fb.group({
      logo: [
        null,
        Validators.compose([
          Validators.required,
          requiredFileType(["jpg", "jpeg", "png"])
        ])
      ],
      banner: [
        null,
        Validators.compose([
          Validators.required,
          requiredFileType(["jpg", "jpeg", "png"])
        ])
      ]
    });
  }

  private entityTypesToArray(): string[] {
    const entityTypes: any[] = ENTITY_TYPE_OPTIONS;
    const entityTypesArray: string[] = [];
    entityTypes.forEach((entity: any) => {
      entityTypesArray.push(entity.value);
    });
    return entityTypesArray;
  }

  private posTypesToArray(): string[] {
    const posTypes: PosType[] = POS_TYPES;
    const posTypesArray: string[] = [];
    posTypes.forEach((type: PosType) => {
      posTypesArray.push(type.value);
    });
    return posTypesArray;
  }
}
