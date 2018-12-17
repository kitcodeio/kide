import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.less']
})
export class BrowserComponent implements OnInit {

  constructor() { }

  setDimentions(h, w): void {
    $("#browser").css("height", h);
    $("#browser").css("width", w);
  }

  ngOnInit() {
    let self = this;
    this.setDimentions($(document).height(), $(document).width()/3);
    $(window).on('resize', function(){
      self.setDimentions($(document).height(), $(document).width()/3);	  
    });
  }

}
