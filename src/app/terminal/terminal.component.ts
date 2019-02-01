import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Terminal } from 'xterm';
import { HttpClient } from '@angular/common/http';

import { XtermService } from '../services/xterm/xterm.service';
import { ViewService } from '../services/view/view.service';
import { UrlService } from '../services/url/url.service';
import { SocketService } from '../services/socket/socket.service';

declare var $:any;

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.less']
})
export class TerminalComponent implements OnInit {

  @ViewChild('terminal') terminal: ElementRef;
  term: Terminal;
  termRowHeight;
  termColWidth;
	
  constructor(private xterm: XtermService, private view: ViewService, private http: HttpClient, private url: UrlService, private socket: SocketService) { }

  setDimentions(h, w): void {
    $("#terminal").css("height", h);
    $("#terminal").css("width", w);
  }

  ngOnInit() {
    let self = this; 
    this.setDimentions(window.innerHeight/3, window.innerWidth - 250);
    $(window).on('resize', function(){
      self.setDimentions(window.innerHeight/3, window.innerWidth - 250);
      let size = self.calculateSize();
      if(self.term) self.term.resize(size.cols, size.rows);
      self.xterm.resize(size);
    });
    this.view.treeVisibilityListener().subscribe((status: boolean) => {
      let val = (status)?250:50;
      this.setDimentions(window.innerHeight/3, window.innerWidth - val);
      let size = this.calculateSize(val);
      if(this.term) this.term.resize(size.cols, size.rows);
      this.xterm.resize(size);
    });
  }

  ngAfterViewInit() {
    let self = this;
    let size = this.calculateSize();
    let interval, state;
    this.xterm.init(size).then(()=>{
      this.term = new Terminal({
        cols: size.cols,
        rows: size.rows,
        theme: {
          background: '#1e1e1e'
        }
      });
      this.term.open(this.terminal.nativeElement);
      this.term.on('key', (key, evt) => {
        this.xterm.write(key);
      });
      this.xterm.on().subscribe(data => {
        this.term.write(data);
      });
      interval = setInterval(() => {
        self.socket.emit('fetch:modules')
      }, 1000);
      this.socket.on('modules').subscribe((data: any) => {
        if (data.status == 'rcv') {
          this.socket.emit('done');
          if (data.array.length !==0){
            if(state !== 'done') this.xterm.write(data.array.join(' && ') + '\n');
          }
          clearInterval(interval);
          state = 'done';
        }
        if(data.status == 'done') clearInterval(interval);
      });
    }).catch(err => {
      console.error(err);
    });
  }

  calculateSize(val?: number): any {
    let rows = Math.floor((window.innerHeight/3)/17.21);
    let cols = Math.floor((window.innerWidth - (val || 250))/9.25);
    return {rows, cols};
  }
}
