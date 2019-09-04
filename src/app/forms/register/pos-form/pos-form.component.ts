import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { POS_TYPES } from 'src/assets/data/pos-types';

@Component({
  selector: 'app-pos-form',
  templateUrl: './pos-form.component.html',
  styleUrls: ['./pos-form.component.scss']
})
export class PosFormComponent implements OnInit, OnDestroy {
  @Input() parentFormGroup: FormGroup;
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  posTypeControl: AbstractControl;
  posOptions: any[] = POS_TYPES;

  constructor() { }

  ngOnInit(): void {
    this.posTypeControl = this.parentFormGroup.get('posType');

    this.watchPosType();
  }

  selectPosType(option: string): void {
    this.posTypeControl.patchValue(option);
  }

  watchPosType(): void {
    this.posTypeControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      if (!this.posTypeControl.touched) {
        this.posTypeControl.markAsTouched();
      }
    })
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

}
