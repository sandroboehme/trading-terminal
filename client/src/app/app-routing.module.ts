import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderBookComponent } from './order-book/order-book.component';
import { TvChartContainerComponent } from './tv-chart-container/tv-chart-container.component';

const routes: Routes = [

  { path: 'order-book', component: OrderBookComponent },
  { path: 'chart', component: TvChartContainerComponent },
  { path: '', redirectTo: '/chart', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
