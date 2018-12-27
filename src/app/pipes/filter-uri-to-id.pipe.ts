import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUriToId'
})
export class FilterUriToIdPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.slice(value.indexOf('/') + 1).replace(/\//g, '-').replace(/\./g, '_');
  }

}
