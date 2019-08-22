import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {
  @Input() parentFormGroup: FormGroup;

  nameControl: AbstractControl;
  websiteControl: AbstractControl;
  descriptionControl: AbstractControl;

  constructor() {}

  ngOnInit(): void {
    this.nameControl = this.parentFormGroup.get('name');
    this.websiteControl = this.parentFormGroup.get('website');
    this.descriptionControl = this.parentFormGroup.get('description');
  }
}
