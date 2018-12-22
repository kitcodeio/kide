import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class XtermService {

  constructor(private socket: SocketService) { }

  on(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('xterm:data').subscribe(data => {
        observer.next(data);
      });
    });
  }

  write(key: any): void {
    this.socket.emit('xterm:key', key);
  }

}
