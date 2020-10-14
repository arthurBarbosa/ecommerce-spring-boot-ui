import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component';
import { ProdutcListComponent } from './components/produtc-list/produtc-list.component';
import { ProductService } from './services/product.service';

@NgModule({
  declarations: [
    AppComponent,
    ProdutcListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
