import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { UrlService } from '../../services/url/url.service';
import { ViewService } from '../../services/view/view.service'

declare var $:any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {

  $PORT: number;
  remeberPort: boolean;

  new_port: number;

  constructor(private http: HttpClient, private url: UrlService, private toastr: ToastrService, public view: ViewService) { }

  getHeight(): string {
    return window.innerHeight + 'px';
  }

  ngOnInit() {
    this.updateSettings();
  }

  viewEndpoint(): void {
    if(!this.remeberPort) $('#set-port').modal('show');
    else window.open(this.url.end_point, '_blank');
  }

  saveSettings(key?: string): void {
    this.http.post(this.url.server + 'settings', {
      port: this.$PORT,
      remeberPort: this.remeberPort
    }).subscribe((data: any) => {
      if (data.status == 'saved') {
        $('.modal').modal('hide');
	if (this.new_port !== this.$PORT) this.toastr.success(`port: ${this.$PORT} exposed`, 'Success', { positionClass:'toast-bottom-right' });
	if (key == 'view') window.open(this.url.end_point, '_blank');
        this.new_port = this.$PORT;
      }
    });
  }

  updateSettings(): void {
    this.http.get(this.url.server + 'settings').subscribe((data: any) => {
      if (!data.error) {
        this.$PORT = data.port;
      	this.remeberPort = data.remeberPort;
        this.new_port = this.$PORT;
      }
    });
  }

}
