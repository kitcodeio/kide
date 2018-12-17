import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {

  constructor() { }

  setDimentions(h, w): void {
    //$("#editor").css("height", h);
    $("#editor").css("width", w);
  }

  ngOnInit() {
    let self = this;
    this.setDimentions($(document).height(), $(document).width()*2/3);
    $(window).on('resize', function(){
      self.setDimentions($(document).height(), $(document).width()*2/3);	  
    });
  }

}
