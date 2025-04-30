import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
} from './core/constants/url-constants';
import { provideHttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,AppRoutingModule],
  providers: [
    provideHttpClient(),
  ],
  bootstrap: [AppComponent],
  exports: [RouterOutlet]
})
export class AppModule {}
