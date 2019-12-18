import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl, Validators } from '@angular/forms';

@Component({
  selector: "edit-dashboard-account-form",
  templateUrl: "./edit-dashboard-account-form.component.html",
  styleUrls: ["./edit-dashboard-account-form.component.scss"]
})
export class EditDashboardAccountFormComponent implements OnInit {
  @Input() parentFormGroup: FormGroup;
  @Input() formLocked: boolean;

  locked: boolean = true;

  emailControl: AbstractControl;
  passwordControl: AbstractControl;
  newPasswordControl: AbstractControl;
  newPasswordMatchControl: AbstractControl;

  constructor() {}

  ngOnInit() {
    this.emailControl = this.parentFormGroup.get("email");
    this.passwordControl = this.parentFormGroup.get("password");
    this.newPasswordControl = this.parentFormGroup.get("newPassword");
    this.newPasswordMatchControl = this.parentFormGroup.get("newPasswordMatch");
  }

}
