import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutcomesComponent } from './components/outcomes/outcomes.component';
import { OutcomeComponent } from './components/outcome/outcome.component';
import { ReportComponent } from './components/report/report.component';
import { LaserComponent } from './components/laser/laser.component';
import { PatternComponent } from './pattern/pattern.component';

const routes: Routes = [
  {
    path: 'outcomes',
    component: OutcomesComponent
  },
  {
    path: 'outcomes/:outcome/:pnr',
    component: OutcomeComponent
  },
  {
    path: 'report/:cluster_uuid/:sys_serial_number/:hostname',
    component: ReportComponent
  },
  {
    path: 'laser',
    component: LaserComponent
  },
  {
    path: 'pattern',
    component: PatternComponent
  },
  { path: '', redirectTo: '/outcomes', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
