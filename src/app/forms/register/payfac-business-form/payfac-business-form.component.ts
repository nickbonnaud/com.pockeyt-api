import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { selectionExistsValidator } from '../../validators/selection-exists-validator';
import { lengthMatchValidator } from '../../validators/length-match-validator';
import { patterns } from '../../validators/patterns';
import { ENTITY_TYPE_OPTIONS } from 'src/assets/data/entity-types-select';
import { STATE_OPTIONS } from 'src/assets/data/states-select';

@Component({
  selector: 'app-payfac-business-form',
  templateUrl: './payfac-business-form.component.html',
  styleUrls: ['./payfac-business-form.component.scss']
})
export class PayfacBusinessFormComponent implements OnInit {

  payFacBusinessForm: FormGroup;
  entityTypes: string[] = ENTITY_TYPE_OPTIONS;
  states: string[] = STATE_OPTIONS;


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.payFacBusinessForm = this.fb.group({
      businessName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      address: ['', Validators.compose([Validators.required])],
      addressSecondary: [''],
      city: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required, selectionExistsValidator(this.states)])],
      zip: ['', Validators.compose([Validators.required, Validators.pattern(patterns.zip), lengthMatchValidator(5)])],
      entityType: ['', Validators.compose([Validators.required, selectionExistsValidator(this.entityTypes)])],
      ein: ['', ]
    });
  }

}
