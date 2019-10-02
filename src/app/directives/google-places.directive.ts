import { Directive, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { } from 'googlemaps';
import { environment } from 'src/environments/environment';
import { GooglePlace } from '../models/business/google-place';

@Directive({
  selector: '[google-place]'
})
export class GooglePlacesDirective implements OnInit {
  @Output() placeSelected: EventEmitter<GooglePlace> = new EventEmitter();

  private element: HTMLInputElement;

  constructor(private elRef: ElementRef) {
    this.element = elRef.nativeElement;
  }

  ngOnInit(): void {
    this.addMapScript();
  }

  addMapScript(): void {
    const mapsUrl = `https://maps.googleapis.com/maps/api/js?key=${environment.google_api_key}&libraries=places`;
    if (! document.querySelectorAll(`[src="${mapsUrl}"]`).length) {
      document.body.appendChild(Object.assign(
        document.createElement('script'), {
          type: 'text/javascript',
          src: mapsUrl,
          onload: () => this.setAutoComplete()
        }
      ));
    } else {
      this.setAutoComplete();
    }
  }

  setAutoComplete(): void {
    const autoComplete = new google.maps.places.Autocomplete(this.element);
    autoComplete.setTypes(['establishment']);
    google.maps.event.addListener(autoComplete, 'place_changed', () => {
      this.placeSelected.emit(new GooglePlace(autoComplete.getPlace()));
    })
  }
}
