import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent {
  title = 'kide';
  show = true;
  width: number;
  height: number;
  constructor() {
    this.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    if ((this.width < 640 || this.height < 480) || this.iFrame() == false) this.show = false;
    window.parent.postMessage('loaded', '*');
  }

  iFrame(){
    try{
      return (window.top !== window.self || window.location.host.includes('localhost'));
    } catch (err) {
      return true;
    }
  }

}
