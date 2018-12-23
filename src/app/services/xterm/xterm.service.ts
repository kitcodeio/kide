import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class XtermService {

  constructor(private socket: SocketService) { }

  init(size: any): Promise<any> {
    this.socket.emit('init:xterm', size);
    return new Promise((resolve, reject) => {
      this.socket.on('xterm:ready').subscribe(data => {
	if (data.error) return reject(data.error);
        else return resolve();
      });
    });
  }

  on(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('xterm:data').subscribe(data => {
        return observer.next(data);
      });
    });
  }

  write(key: any): void {
    this.socket.emit('xterm:key', key);
  }

}
