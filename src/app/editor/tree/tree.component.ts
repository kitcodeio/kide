import { Component, Input, OnInit } from '@angular/core';

import { FileService } from '../../services/file/file.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class TreeComponent implements OnInit {

  @Input() isRoot: boolean;
  @Input() dir: any[];
  @Input() open: Function;
  childDir: any[];

  constructor(private fs: FileService) { }

  getFileOrDir(el: any, index: number): void {
    if (el.type == 'file') this.fs.readFile(el.uri).then(content => {
      this.open({
        uri: el.uri, content
      });
    });
    else if (el.type == 'dir') {
      if(el.state == 'open') {
        delete this.dir[index].dir;
        this.dir[index].state = 'close'
      } else {
	this.fs.readDir(el.uri).then(list => {
          this.dir[index].dir=list;	
	  this.dir[index].state = 'open'
	});
      }
    }
  }

  ngOnInit() {
  }

}
