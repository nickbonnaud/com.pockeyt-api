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

  owners: Owner[] = [];

  constructor(private fcProvider: FormControlProviderService) {}

  ngOnInit() {
    this.profileForm = this.fcProvider.registerProfileControls();
    this.payFacBusinessForm = this.fcProvider.registerPayfacBusinessControls();
    this.payFacOwnerForm = this.fcProvider.registerPayfacOwnerControls(this.owners);
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
}
