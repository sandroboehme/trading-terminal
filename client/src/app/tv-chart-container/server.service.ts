import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable()
export class ServerService {

  apiPrefix = '/api';

  constructor(private http: HttpClient) {
  }

  // Uses http.get() to load data from a single API endpoint
  getBars(fromTs: string, toTs: string, fromSymbol: any, toSymbol: any, exchange: any): Observable<any> {

    const params = { from_ts: fromTs, to_ts: toTs };
    const options = {
      headers,
      params,
      observe: 'response' as 'body'
    };
    return this.http.get(this.apiPrefix + '/get-bars', options);
  }
}
