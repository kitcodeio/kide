import { Component, OnInit, ViewChild } from '@angular/core';
import { MonacoFile, MonacoEditorDirective } from 'ngx-monaco';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FileService } from '../services/file/file.service';

declare var $:any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {

  theme = 'vs-dark';

  options = {
    quickSuggestions: true,
    experimentalDecorators: false
  };

  dir: any[] = [];

  file;
  newFile;

  fileChange = new Subject<MonacoFile>();

  @ViewChild(MonacoEditorDirective) editor: MonacoEditorDirective;

  open(file: any): void {
    this.file = file;
  }

  onReady(editor: monaco.editor.IEditor) {
    this.fs.init().then(data => {
      this.dir = data;
    });
  }

  constructor(private fs: FileService, private toastr: ToastrService) { }

  setDimentions(h, w): void {
    $("#editor").css("height", h);
    $("monaco-editor").css("height", h, 'important');
    $(".root").css("height");
    $("#editor").css("width", w);
  }

  ngOnInit() {
    let self = this;
  
    this.setDimentions($(document).height()*2/3, $(document).width());
    $(window).on('resize', function(){
      self.setDimentions($(document).height()*2/3, $(document).width());	  
    });

    this.fileChange
      .pipe(debounceTime(1000), distinctUntilChanged((a, b) => a.content === b.content))
      .subscribe(file => this.autoSave(file)); 

    $(document).on('keydown', function(event) {
      if (event.keyCode == 83 && event.ctrlKey) {
        event.preventDefault();
	self.toastr.success('file saved', 'Success', { positionClass:'toast-bottom-right' });
      }
    }); 
  }

  autoSave(file: any): void {
    this.fs.saveFile(file).then(res => {}).catch(err => {
      console.log(err);
    });
  }

}
