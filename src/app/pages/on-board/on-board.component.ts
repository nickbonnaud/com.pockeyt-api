import { BusinessService } from './../../services/business.service';
import { FormControlProviderService } from './../../forms/services/form-control-provider.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Owner } from 'src/app/models/business/owner';
import { Business } from 'src/app/models/business/business';

@Component({
  selector: 'app-on-board',
  templateUrl: './on-board.component.html',
  styleUrls: ['./on-board.component.scss']
})
export class OnBoardComponent implements OnInit {
  profileForm: FormGroup;
  businessForm: FormGroup;
  ownerForm: FormGroup;
  bankForm: FormGroup;
  photosForm: FormGroup;
  mapForm: FormGroup;

  owners: Owner[] = [];

  constructor(private fcProvider: FormControlProviderService, private businessService: BusinessService) {}

  ngOnInit() {
    this.profileForm = this.fcProvider.registerProfileControls();
    this.businessForm = this.fcProvider.registerBusinessControls();
    this.ownerForm = this.fcProvider.registerOwnerControls(this.owners);
    this.bankForm = this.fcProvider.registerBankControls();
    this.photosForm = this.fcProvider.registerPhotosControls();
    this.mapForm = this.fcProvider.registerMapControls();
  }

  profileSubmit() {
    this.profileForm.markAsDirty();
  }

  businessSubmit(): void {
    this.businessForm.markAsDirty();
  }

  ownerSubmit(): void {
    this.ownerForm.markAsDirty();
  }

  bankFormSubmit(): void {
    this.bankForm.markAsDirty();
  }

  photosFormSubmit(): void {
    this.photosForm.markAsDirty();
  }

  mapFormSubmit(): void {
    this.photosForm.markAsDirty();
  }

  changeOwners(owners: Owner[]): void {
    this.owners = owners;
  }
}
