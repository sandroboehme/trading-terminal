import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TvChartContainerComponent } from './tv-chart-container/tv-chart-container.component';
import { ServerService } from './tv-chart-container/server.service';
import { HttpClientModule } from '@angular/common/http';
import { OrderBookComponent } from './order-book/order-book.component';
import { OrderBookService } from './order-book/order-book.service';

@NgModule({
  declarations: [
    AppComponent,
    TvChartContainerComponent,
    OrderBookComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [ServerService, OrderBookService],
  bootstrap: [AppComponent]
})
export class AppModule { }
