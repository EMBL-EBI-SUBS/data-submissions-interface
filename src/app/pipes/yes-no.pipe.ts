import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yesno'
})
export class YesNoPipe implements PipeTransform {

  transform(value: string | boolean | null, truthy = 'Yes', falsy = 'No'): string {
    return value === '1' || value === true ? ` ${truthy} ` : ` ${falsy} `;
  }

}
