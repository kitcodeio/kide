import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

import { UrlService } from '../url/url.service'

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;

  constructor(private url: UrlService) {
    this.socket = io(this.url.server);
  }

  on(evt): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on(evt, res => observer.next(res));
    });
  }      

  emit(evt: string, data?: any): void {
    this.socket.emit(evt, data);
  }

}
