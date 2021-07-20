import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
   constructor(private router: Router, private toastr: ToastrService, private spinnerService : NgxSpinnerService) {}

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        tap(x => this.spinnerService.show()),
        delay(1000),
        tap(x => this.spinnerService.hide()),
         catchError(error => {
            if (error) {
               if (error.status === 400) {
                  if (error.error.errors) {
                     throw error.error;
                  } else {
                     this.toastr.error(error.error.message, error.error.statusCode);
                  }
               }

               if (error.status === 404) {
                  this.router.navigateByUrl('/not-found');
               }

               if (error.status === 500) {
                  const navigationExtras: NavigationExtras = { state: { error: error.error } };
                  this.router.navigateByUrl('/server-error', navigationExtras);
               }
            }

            return throwError(error);
         })
      );
   }
}
