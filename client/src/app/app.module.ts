import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, NG_VALIDATORS } from '@angular/forms';

import { AppComponent } from './app.component';
import { OutcomesComponent } from './components/outcomes/outcomes.component';
import { OutcomeComponent } from './components/outcome/outcome.component';
import { ReportComponent } from './components/report/report.component';
import { ModalProblemComponent } from './components/popups/modal-problem/modal-problem.component';
import { ChartComponent } from './components/chart/chart.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AlertComponent } from './components/alert/alert.component';
import {
  LocationStrategy,
  PathLocationStrategy,
  HashLocationStrategy
} from '@angular/common';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { LaserComponent } from './components/laser/laser.component';
import { PatternComponent } from './pattern/pattern.component';

@NgModule({
  imports: [BrowserModule, FormsModule, AppRoutingModule, HttpClientModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ],
  exports: [],
  declarations: [
    AppComponent,
    OutcomesComponent,
    OutcomeComponent,
    ReportComponent,
    ModalProblemComponent,
    ChartComponent,
    LoaderComponent,
    AlertComponent,
    LaserComponent,
    PatternComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
