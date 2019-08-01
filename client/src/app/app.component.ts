// import { Ng6O2ChartModule } from 'ng6-o2-chart'; // <= Add
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// import * as ChartConst from 'ng6-o2-chart'; // <= Add

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Low Touch POC';
  constructor(private router: Router) {}
  mainHeader_clicked() {
    this.router.navigate(['']);
  }
}
