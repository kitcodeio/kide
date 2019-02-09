import { Component, Input, OnInit } from '@angular/core';

import { FileService } from '../../services/file/file.service';
import { SocketService } from '../../services/socket/socket.service';

declare var $:any;

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class TreeComponent implements OnInit {

  dirName: any;
  @Input() isRoot: boolean;
  @Input() dir: any[];
  @Input() open: Function;
  @Input() reload: Function;
  @Input() width: number;
  @Input() createFile: Function;

  constructor(private fs: FileService, private socket: SocketService) {
    //this.setDimentions($(document).height(), $(document).width()*3/4);
  }

  setDimentions(h, w): void {
    $(".root").css("height", h);
  }

  getHeight(): string {
    return window.innerHeight + 'px';
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
          this.fs.readDir(el.uri).then(data => {
            this.dir[index].dir=data.dirList;
	          this.dir[index].state = 'open';
	        });
	       else this.dir[index].state = 'open';
      }
    }
  }

  ngOnInit() {
    if(this.dir.length) this.dirName = this.dir[0].uri.substring(0, this.dir[0].uri.lastIndexOf('/'));
    this.socket.on('activity').subscribe(obj => {
      if(obj.file.substring(0, obj.file.lastIndexOf('/')) == this.dirName) {
        console.log(obj);
        switch(obj.event){
          case 'unlink':
            this.dir = this.dir.filter(el => (obj.file !== el.uri && el.type == 'file'));
            break;
          case 'unlinkDir':
            this.dir = this.dir.filter(el => (obj.file !== el.uri && el.type == 'dir'));
            break;
          case 'add':
            this.dir.push({
              type: 'file',
              uri: obj.file,
              name: obj.file.substring(obj.file.lastIndexOf('/') + 1)
            });
            break;
          case 'addDir':
            this.dir.push({
              type: 'dir',
              uri: obj.file,
              name: obj.file.substring(obj.file.lastIndexOf('/') + 1)
            });
            break;
        }
      }
    });
  }

}
