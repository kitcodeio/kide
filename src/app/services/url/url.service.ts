import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  value: string = '/';

  constructor() {
    if(window.location.host.includes('localhost')) this.value = 'http://localhost:8080/';
  }
}
