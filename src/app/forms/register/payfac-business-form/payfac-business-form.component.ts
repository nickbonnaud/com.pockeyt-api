import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { selectionExistsValidator } from '../../validators/selection-exists-validator';
import { lengthMatchValidator } from '../../validators/length-match-validator';
import { patterns } from '../../validators/patterns';
import { ENTITY_TYPE_OPTIONS } from 'src/assets/data/entity-types-select';
import { STATE_OPTIONS } from 'src/assets/data/states-select';
import { requiredIfValidator } from '../../validators/required-if-validator';

@Component({
  selector: 'app-payfac-business-form',
  templateUrl: './payfac-business-form.component.html',
  styleUrls: ['./payfac-business-form.component.scss']
})
export class PayfacBusinessFormComponent implements OnInit {
  payFacBusinessForm: FormGroup;
  entityTypes: any[] = ENTITY_TYPE_OPTIONS;
  states: string[] = STATE_OPTIONS;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.payFacBusinessForm = this.fb.group({
      businessName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      address: ['', Validators.compose([Validators.required])],
      addressSecondary: [''],
      city: ['', Validators.compose([Validators.required])],
      state: [
        '',
        Validators.compose([Validators.required, selectionExistsValidator(this.states)])
      ],
      zip: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.numbers_only),
          lengthMatchValidator(5)
        ])
      ],
      entityType: [
        '',
        Validators.compose([
          Validators.required,
          selectionExistsValidator(this.entityTypesToArray())
        ])
      ],
      ein: [
        '',
        Validators.compose([
          Validators.pattern(patterns.numbers_only),
          lengthMatchValidator(10),
          requiredIfValidator(
            this.payFacBusinessForm.get('entityType'),
            this.entityTypesRequiringEin()
          )
        ])
      ]
    });
  }

  payFacBusinessSubmit(): void {
    this.payFacBusinessForm.markAsDirty();
  }

  entityTypesToArray(): string[] {
    const entityTypesArray: string[] = [];
    this.entityTypes.forEach((entity: any) => {
      entityTypesArray.push(entity.value);
    });
    return entityTypesArray;
  }

  entityTypesRequiringEin(): string[] {
    const allTypes: string[] = this.entityTypesToArray();
    return allTypes.splice(allTypes.indexOf('soleProprietorship'), 1);
  }
}
