import { Injectable } from '@angular/core';

import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private socket: SocketService) { }

  init(): Promise<any> {	  
    this.socket.emit('init');
    return new Promise((resolve, reject) => {
      this.socket.on('dir:list').subscribe(data => {
        return resolve(data);
      });
    });
  }

  readFile(path: any): Promise<any> {
    this.socket.emit('read:file', path);
    return new Promise((resolve, reject) => {
      this.socket.on('file').subscribe(data => {
        return resolve(data);
      });
    });
  }

  readDir(path: any): Promise<any> {	  
    this.socket.emit('read:dir', path);
    return new Promise((resolve, reject) => {
      this.socket.on('dir:list').subscribe(data => {
        return resolve(data);	    
      });
    });
  }

  saveFile(file: any): Promise<any> {
    this.socket.emit('save:file', file);
    return new Promise((resolve, reject) => {
      this.socket.on('file:saved').subscribe(response => {
        return (response.status == "error")?reject(response.error):resolve(response.message);
      });
    });
  };

}
