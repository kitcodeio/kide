import { Component, OnInit } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.less']
})
export class TerminalComponent implements OnInit {

  constructor() { }

  setDimentions(h, w): void {
    //$("#terminal").css("height", h);
    $("#terminal").css("width", w);
  }

  ngOnInit() {
    let self = this;
	  this.setDimentions($(document).height(), $(document).width()*3/4);
    $(window).on('resize', function(){
	    self.setDimentions($(document).height(), $(document).width()*3/4);	  
    });
  }

}
