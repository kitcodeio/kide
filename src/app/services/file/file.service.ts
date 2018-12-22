import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  socket: any;

  constructor() {
    this.socket = io('http://localhost:8080');
  }

  init(): Promise<any> {	  
    this.socket.emit('init');
    return new Promise((resolve, reject) => {
      this.socket.on('dir:list', data => {
        return resolve(data);
      });
    });
  }

  readFile(path: any): Promise<any> {
    this.socket.emit('read:file', path);
    return new Promise((resolve, reject) => {
      this.socket.on('file', data => {
        return resolve(data);
      });
    });
  }

  readDir(path: any): Promise<any> {	  
    this.socket.emit('read:dir', path);
    return new Promise((resolve, reject) => {
      this.socket.on('dir:list', data => {
	return resolve(data);	    
      });
    });
  }

  saveFile(file: any): Promise<any> {
    this.socket.emit('save:file', file);
    return new Promise((resolve, reject) => {
      this.socket.on('file:saved', response => {
        return (response.status == "error")?reject(response.error):resolve(response.message);
      });
    });
  };
}
