import { GooglePlace } from './../../../models/business/google-place';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-map-form',
  templateUrl: './map-form.component.html',
  styleUrls: ['./map-form.component.scss']
})
export class MapFormComponent implements OnInit {
  @Input() parentFormGroup: FormGroup;
  @Input() googlePlace: GooglePlace
  @Output() coordsChanged: EventEmitter<any> = new EventEmitter();


  radiusControl: AbstractControl;

  constructor() { }

  ngOnInit(): void {
    this.radiusControl = this.parentFormGroup.get('radius');
  }

  setNewCoords(center): void {
    this.coordsChanged.emit(center.coords);
  }

}
