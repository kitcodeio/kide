import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { MonacoEditorModule } from 'ngx-monaco';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { BrowserComponent } from './browser/browser.component';
import { TerminalComponent } from './terminal/terminal.component';
import { UrlSantizerPipe } from './url-santizer.pipe';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    BrowserComponent,
    TerminalComponent,
    UrlSantizerPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MonacoEditorModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
