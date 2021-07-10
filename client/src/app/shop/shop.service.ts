import { Observable } from 'rxjs';
import { IPagination } from './../models/pagination';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
   providedIn: 'root',
})
export class ShopService {
   private baseUrl = 'https://localhost:5001/api';

   constructor(private http: HttpClient) {}

   public getProducts(): Observable<IPagination> {
      return this.http.get<IPagination>(`${this.baseUrl}/products`);
   }
}
