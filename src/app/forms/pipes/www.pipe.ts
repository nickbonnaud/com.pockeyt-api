import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'www'
})
export class WwwPipe implements PipeTransform {

  transform(url: string, focused: boolean): string {
    if (!focused && url == '') {
      return "";
    } else {
      return  url.startsWith("http://") ||
            url.startsWith('https://') ?
            url : `http://${url}`;
    }
  }

}
