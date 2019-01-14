import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  end_point: string = 'https://kitcode.io';
  server: string = '/';

  constructor() {
    if(window.location.host.includes('localhost')) this.server = 'http://localhost:54123/';
    this.end_point = window.location.protocol+'//'+window.location.host.split('-')[0]+'-app.kitcode.io';
  }
}
