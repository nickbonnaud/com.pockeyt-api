import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by"
      >Created with ♥ by <b>{{ appName }}.ai</b> 2019. Template from
      <b><a href="https://akveo.com" target="_blank">Akveo</a></b></span
    >
  `
})
export class FooterComponent {
  appName: string = environment.app_name;
}
