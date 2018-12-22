import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;

  constructor() {
    this.socket = io('http://localhost:8080');
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
