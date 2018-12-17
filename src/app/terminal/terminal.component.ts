import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

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
    this.setDimentions($(document).height(), $(document).width()*2/3);
    $(window).on('resize', function(){
      self.setDimentions($(document).height(), $(document).width()*2/3);	  
    });
  }

}
