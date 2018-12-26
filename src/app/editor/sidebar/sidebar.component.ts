import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { UrlService } from '../../services/url/url.service'

declare var $:any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {

  $PORT: number;
  remeberPort: boolean;

  constructor(private http: HttpClient, private url: UrlService, private toastr: ToastrService) { }

  getHeight(): string {
    return window.innerHeight + 'px';
  }

  ngOnInit() {
    this.updateSettings();
  }

  viewEndpoint(): void {
    if(!this.remeberPort) $('#set-port').modal('show');
  }

  saveSettings(): void {
    this.http.post(this.url.value + 'settings', {
      port: this.$PORT,
      remeberPort: this.remeberPort
    }).subscribe((data: any) => {
      if (data.status == 'saved') {
        $('.modal').modal('hide');
	      this.toastr.success(`port: ${this.$PORT} exposed`, 'Success', { positionClass:'toast-bottom-right' });
      }
    });
  }

  updateSettings(): void {
    this.http.get(this.url.value + 'settings').subscribe((data: any) => {
      if (!data.error) {
        this.$PORT = data.port,
	this.remeberPort = data.remeberPort
      }
    });
  }

}
