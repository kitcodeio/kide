import { Component, OnInit, ViewChild } from '@angular/core';
import { MonacoFile, MonacoEditorDirective } from 'ngx-monaco';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as $ from 'jquery';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {

  theme = 'vs-dark';
	
  files: MonacoFile[] = [{
    uri : 'index.js',
    content: "'use strict';\nconsole.log('Hello World');"
  }, {
    uri : 'package.json',
    content: '{\n  "name": "hello-world",\n  "version": "0.0.0"\n}'
  }];

  file = this.files[0];

  fileChange = new Subject<MonacoFile>();

  @ViewChild(MonacoEditorDirective) editor: MonacoEditorDirective;

  open(file: any): void {
    this.file = file;
  }

  onReady(editor: monaco.editor.IEditor) {
    //console.log(editor);
    // Bootstrap(editor);
  }

  constructor() { }

  setDimentions(h, w): void {
    //$("#editor").css("height", h);
    $("#editor").css("width", w);
  }

  ngOnInit() {
    let self = this;
    this.setDimentions($(document).height()*2/3, $(document).width()*2/3);
	  
    $(window).on('resize', function(){
      self.setDimentions($(document).height()*2/3, $(document).width()*2/3);	  
    });
	  
    this.fileChange
      .pipe(debounceTime(1000), distinctUntilChanged((a, b) => a.content === b.content))
      .subscribe(file =>console.log(file)); 
	  
    $(document).on('keydown', function(event) {
      if (event.keyCode == 83 && event.ctrlKey) {
        event.preventDefault();
	//=========do something to save document=========//
      }
    }); 
  }

}
