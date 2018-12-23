import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Terminal } from 'xterm';

import { XtermService } from '../services/xterm/xterm.service';

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
	
  constructor(private xterm: XtermService) { }

  setDimentions(h, w): void {
    $("#terminal").css("height", h);
    $("#terminal").css("width", w);
  }

  ngOnInit() {
    let self = this; 
    this.setDimentions($(document).height()/3, $(document).width()*3/4);
    $(window).on('resize', function(){
      self.setDimentions($(document).height()/3, $(document).width()*3/4);	  
    });
  }

  ngAfterViewInit() {
    let size = this.calculateSize();
    this.xterm.init(size).then(()=>{
      this.term = new Terminal({
        cols: size.cols,
        rows: size.rows,
        theme: {
          background: '#1e1e1e'
        }
      });
      this.term.open(this.terminal.nativeElement);
      //this.xterm.write(String.fromCharCode(13));
      this.term.on('key', (key, evt) => {
        this.xterm.write(key);
      });
      this.xterm.on().subscribe(data => {
        this.term.write(data);
      });
    }).catch(err => {
      console.error(err);
    });
  }

  calculateSize(): any {
    let rows = (Math.floor($('#terminal').innerHeight() / 15)) -4;
    let cols = (Math.floor($('#terminal').innerWidth() / 9)) -4;
    return {rows, cols};
  }

}
