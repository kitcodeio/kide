import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonacoEditorModule } from 'ngx-monaco';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { BrowserComponent } from './browser/browser.component';
import { TerminalComponent } from './terminal/terminal.component';
import { UrlSantizerPipe } from './pipes/url-santizer.pipe';
import { TreeComponent } from './editor/tree/tree.component';
import { FilterUriToIdPipe } from './pipes/filter-uri-to-id.pipe';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    BrowserComponent,
    TerminalComponent,
    UrlSantizerPipe,
    TreeComponent,
    FilterUriToIdPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MonacoEditorModule.forRoot(),
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }