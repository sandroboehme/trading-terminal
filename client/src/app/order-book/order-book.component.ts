import { Component, OnInit } from '@angular/core';
import { OrderBookService } from './order-book.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'tt-order-book',
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.scss']
})
export class OrderBookComponent implements OnInit {
  liveData$: Observable<any>;

  constructor(private orderBookService: OrderBookService) {
  }

  ngOnInit(): void {
    /*
    this.orderBookService.connect();
    this.liveData$ = this.orderBookService.messages$.pipe(
      map(rows => {
        console.log('rows: ', rows);
        return rows;
      }),
      catchError(error => { throw error }),
      tap({
          error: error => console.log('[Live component] Error:', error),
          complete: () => console.log('[Live component] Connection Closed')
        }
      )
    );
     */
    this.orderBookService.getNewWebSocket().asObservable()
      .subscribe(dataFromServer => {
        console.log(dataFromServer);
      });
  }

}
