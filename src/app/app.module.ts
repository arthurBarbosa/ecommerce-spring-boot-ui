import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProdutcListComponent } from './components/produtc-list/produtc-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ProdutcListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
