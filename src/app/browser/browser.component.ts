import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

declare var $:any;

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.less']
})
export class BrowserComponent implements OnInit {

   endPoint: String;
   url: String;
   interval;
   width: number = 1;
   rate: number = 10;

  constructor(private domSanitizer: DomSanitizer) { }

  setDimentions(h, w): void {
    $("#browser").css("height", h);
    $("#browser").css("width", w);
  }

  setFrameDimentions(h, w): void {
    $("#browser-output").css("height", h-79);
    $("#browser-output").css("width", w);
  }

  initProgressBar(): void {	  
    let self = this;
    let bar = function(){
      if(self.width >= 50) {
        clearInterval(self.interval);
	self.rate = self.rate * 2;
        self.width = self.width + 1;
	$('#myBar').css("width", self.width + "%");      
	self.interval = setInterval(bar, self.rate);
      } else {
        self.width = self.width + 1;
	$('#myBar').css("width", self.width + "%");
      }
    }	  
    this.width = 1;
    this.interval = setInterval(bar, this.rate);  
  }

  reload(): void {
    if (this.url) {
      this.initProgressBar();
      $('#browser-output')[0].src = $('#browser-output')[0].src;
    }
  }

  openUrl(): void {
    if (this.url) {
      if (this.endPoint == this.url) this.reload();
      else {
        this.initProgressBar();
        this.endPoint = this.url;
        this.setFrameDimentions($(document).height(), $(document).width()/4);
      }
    }
  }

  ngOnInit() {
    let self = this;
    this.setDimentions($(document).height(), $(document).width()/4);	  
    this.setFrameDimentions($(document).height(), $(document).width()/4);
    $(window).on('resize', function(){
      self.setDimentions($(document).height(), $(document).width()/4);	  
      self.setFrameDimentions($(document).height(), $(document).width()/4);
    });
    $('#browser-output').on('load', function(event){
      clearInterval(self.interval);
      self.rate = 10;	    
      self.interval = setInterval(function(){
        if(self.width >= 100) clearInterval(self.interval);
        else {
	  self.width = self.width + 1;  
	  $('#myBar').css("width", self.width + "%");
	}
      }, 5);  
    });
    $('#url').on('keypress', function(event){
      if (event.keyCode == 13 && self.url) self.openUrl();
    });
  }

}
