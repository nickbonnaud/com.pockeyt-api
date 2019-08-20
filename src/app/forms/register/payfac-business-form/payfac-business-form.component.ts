import { FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { ENTITY_TYPE_OPTIONS } from 'src/assets/data/entity-types-select';
import { STATE_OPTIONS } from 'src/assets/data/states-select';

@Component({
  selector: 'app-payfac-business-form',
  templateUrl: './payfac-business-form.component.html',
  styleUrls: ['./payfac-business-form.component.scss']
})
export class PayfacBusinessFormComponent {
  @Input() parentFormGroup: FormGroup;

  entityTypes: any[] = ENTITY_TYPE_OPTIONS;
  states: string[] = STATE_OPTIONS;

  constructor() {}
}
