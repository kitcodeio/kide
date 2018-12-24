import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUriToId'
})
export class FilterUriToIdPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.slice(3).split('/').join('-');
  }

}
