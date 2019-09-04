import { GooglePlace } from './../../models/business/google-place';
import { FormControlProviderService } from './../../forms/services/form-control-provider.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Owner } from 'src/app/models/business/owner';

@Component({
  selector: 'app-on-board',
  templateUrl: './on-board.component.html',
  styleUrls: ['./on-board.component.scss']
})
export class OnBoardComponent implements OnInit {
  profileForm: FormGroup;
  payFacBusinessForm: FormGroup;
  payFacOwnerForm: FormGroup;
  bankForm: FormGroup;
  photosForm: FormGroup;

  owners: Owner[] = [];
  googlePlace: GooglePlace;

  constructor(private fcProvider: FormControlProviderService) {}

  ngOnInit() {
    this.profileForm = this.fcProvider.registerProfileControls();
    this.payFacBusinessForm = this.fcProvider.registerPayfacBusinessControls();
    this.payFacOwnerForm = this.fcProvider.registerPayfacOwnerControls(this.owners);
    this.bankForm = this.fcProvider.registerBankControls();
    this.photosForm = this.fcProvider.registerPhotosControls();
  }

  setPlace(googlePlace: GooglePlace) {
    this.googlePlace = googlePlace;
  }

  profileSubmit() {
    this.profileForm.markAsDirty();
  }

  payFacBusinessSubmit(): void {
    this.payFacBusinessForm.markAsDirty();
  }

  payFacOwnerSubmit(): void {
    this.payFacOwnerForm.markAsDirty();
  }

  bankFormSubmit(): void {
    this.bankForm.markAsDirty();
  }

  photosFormSubmit(): void {
    this.photosForm.markAsDirty();
  }

  addOwner(owner: Owner): void {
    this.owners.push(owner);
  }
}
