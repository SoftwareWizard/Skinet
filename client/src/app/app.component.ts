import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IPagination } from './shared/models/pagination';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
   title = 'Skinet';
   pagination: IPagination = {} as IPagination;

   constructor(private http: HttpClient) {}

   async ngOnInit(): Promise<void> {
      this.pagination = await this.http
         .get<IPagination>('https://localhost:5001/api/products')
         .toPromise();
   }
}
