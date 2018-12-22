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
    this.termRowHeight = 0.0 + (1.00 * $('#terminal').innerHeight() / 25);
    this.termColWidth = 0.0 + (1.02 * $('#terminal').innerWidth() / 80);
    this.startTerminal();
  }

  calculateSize(): any {
    let rows = Math.max(2, Math.floor(window.innerHeight/this.termRowHeight) - 2);
    let cols = Math.max(3, Math.floor(window.innerWidth/this.termColWidth) - 2);
    return {rows, cols};
  }

  startTerminal(): void {
    let size = this.calculateSize();  
    this.term = new Terminal({
      cols: 157,
      rows: 17,
      theme: {
        background: '#1e1e1e'
      }
    });
    this.term.open(this.terminal.nativeElement);	  
    this.xterm.write(String.fromCharCode(13));
    this.term.on('key', (key, evt) => {
      this.xterm.write(key);
    });
    this.xterm.on().subscribe(data => {
      this.term.write(data);
    });
  }

}
