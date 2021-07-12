import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
   selector: 'app-test-error',
   templateUrl: './test-error.component.html',
   styleUrls: ['./test-error.component.scss'],
})
export class TestErrorComponent implements OnInit {
   baseUrl = environment.apiUrl;
   validationErrors: any;

   constructor(private http: HttpClient) {}

   ngOnInit(): void {}

   async get404Error() {
      try {
         var response = await this.http.get(`${this.baseUrl}/buggy/notfound/42`).toPromise();
      } catch (error) {
         console.log(error);
      }
   }

   async get500Error() {
      try {
         await this.http.get(`${this.baseUrl}/buggy/servererror`).toPromise();
      } catch (error) {
         console.log(error);
      }
   }

   async get400Error() {
      try {
         await this.http.get(`${this.baseUrl}/buggy/badrequest`).toPromise();
      } catch (error) {
         console.log(error);
      }
   }

   async get400ValidationError() {
      try {
         await this.http.get(`${this.baseUrl}/products/fortytwo`).toPromise();
      } catch (error) {
         console.log(error);
         this.validationErrors = error.errors;
      }
   }
}
