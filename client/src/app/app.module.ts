import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
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

@NgModule({
  imports: [BrowserModule, FormsModule, AppRoutingModule, HttpClientModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
    // {
    //   provide: NG_VALIDATORS,
    //   useExisting: SelectRequiredValidatorDirective,
    //   multi: true
    // }
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
    AlertComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
