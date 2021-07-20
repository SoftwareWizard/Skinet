import { NgxSpinnerModule } from 'ngx-spinner';
import { ErrorInterceptor } from './core/interceptors/error-interceptor';
import { HomeModule } from './home/home.module';
import { CoreModule } from './core/core.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';

@NgModule({
   declarations: [AppComponent],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      NgxSpinnerModule,
      HttpClientModule,
      CoreModule,
      HomeModule,
   ],
   providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
   bootstrap: [AppComponent],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
