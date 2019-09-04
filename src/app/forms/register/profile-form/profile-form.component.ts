import { GooglePlace } from './../../../models/business/google-place';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {
  @Input() parentFormGroup: FormGroup;
  @Output() placeSelected: EventEmitter<GooglePlace> = new EventEmitter();

  nameControl: AbstractControl;
  websiteControl: AbstractControl;
  descriptionControl: AbstractControl;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.nameControl = this.parentFormGroup.get('name');
    this.websiteControl = this.parentFormGroup.get('website');
    this.descriptionControl = this.parentFormGroup.get('description');
  }

  setPlace(place: GooglePlace): void {
    this.nameControl.patchValue(place.name);
    this.websiteControl.patchValue(place.website);
    this.websiteControl.markAsTouched();
    this.placeSelected.emit(place);
    this.ref.detectChanges();
  }
}
