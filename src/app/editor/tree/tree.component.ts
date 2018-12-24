import { Component, Input, OnInit } from '@angular/core';

import { FileService } from '../../services/file/file.service';

declare var $:any;

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class TreeComponent implements OnInit {

  @Input() isRoot: boolean;
  @Input() dir: any[];
  @Input() open: Function;
  @Input() reload: Function;
  childDir: any[];

  constructor(private fs: FileService) { }

  setDimentions(h, w): void {
    $(".root").css("height", h);
  }

  getFileOrDir(el: any, index: number): void {
    if (el.type == 'file') this.fs.readFile(el.uri).then(content => {
      this.open({
        uri: el.uri, content
      });
    });
    else if (el.type == 'dir') {
      if(el.state == 'open') {
        this.dir[index].state = 'close'
      } else {
	if(this.dir[index].dir == undefined)
            this.fs.readDir(el.uri).then(list => {
            this.dir[index].dir=list;
	    this.dir[index].state = 'open';
	  });
	else this.dir[index].state = 'open';
      }
    }
  }

  ngOnInit() { 
    this.setDimentions($(document).height()*2/3, $(document).width()*3/4);
  }

}
