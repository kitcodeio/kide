import { Component, OnInit, ViewChild } from '@angular/core';
import { MonacoFile, MonacoEditorDirective } from 'ngx-monaco';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ResizeEvent } from 'angular-resizable-element';

import { ViewService } from '../services/view/view.service';
import { FileService } from '../services/file/file.service';

declare var $:any;

if (!Array.prototype.hasOwnProperty("path")) {
  Object.defineProperty(Array.prototype, "path", {
    get: function() {
      this.pop();
      return this.join('/');
    }
  });
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {

  activeFile: string;

  activeDir: string;

  theme = 'vs-dark';

  options = {
    quickSuggestions: true,
    experimentalDecorators: false,
    automaticLayout: true
  };

  dir: any[] = [];

  file;

  treeWidth: number = 250;

  newFilePath: string;

  fileChange = new Subject<MonacoFile>();

  @ViewChild(MonacoEditorDirective) editor: MonacoEditorDirective;

  open(file: any): void {
    this.file = file;
    this.activeFile = file.uri,
    this.activeDir = file.uri.split('/').path;
    $('.selected').removeClass('selected');
    $('#'+file.uri.slice(file.uri.indexOf('/') + 1).replace(/\//g, '-').replace(/\./g, '_')).addClass('selected');
  }

  onReady(editor: monaco.editor.IEditor) {
    this.fs.init().then(data => {
      this.dir = data.dirList;
      this.activeDir = data.dirPath;
      if (this.dir.length == 0) this.createNewFile();
    });
  }

  constructor(private fs: FileService, private toastr: ToastrService, public view: ViewService) { }

  setDimentions(h, w): void {
    $("#editor").css("height", h);
    $("monaco-editor").css("height", h, 'important');
    $(".root").css("height");
    $("#editor").css("width", w);
  }

  ngOnInit() {
    let self = this;

    this.setDimentions(window.innerHeight*2/3, window.innerWidth);
    $(window).on('resize', function(){
      self.setDimentions(window.innerHeight*2/3, window.innerWidth);
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

  createNewFile(): void {
    this.newFilePath = this.activeDir+'/Untitled.js';
    $('#create-new-file').modal('show');
  }

  createFile(): void {
    let file = {
      uri: this.newFilePath,
      content: ''
    };
    this.fs.saveFile(file).then(err => {
      if (err) return console.error(err);
      this.open(file);
      $('#create-new-file').modal('hide');
    });
  }

  onResizeEnd(event: ResizeEvent): void {
    console.log('Element was resized', event.edges.right);
    this.treeWidth = this.treeWidth + Number(event.edges.right);
    //insert these in the apptree tag to make resizing work
    //mwlResizable
    //[enableGhostResize]="true"
    //[resizeEdges]="{right: true}"
    //(resizeEnd)="onResizeEnd($event)"
  }

}
