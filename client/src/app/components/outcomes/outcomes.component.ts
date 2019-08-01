import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-outcomes',
  templateUrl: './outcomes.component.html',
  styleUrls: ['./outcomes.component.scss']
})
export class OutcomesComponent implements OnInit {
  result: any;
  subscription: any;
  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.subscription = this.apiService
      .getDistinctOutcomes()
      .subscribe(data => {
        this.result = data;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
