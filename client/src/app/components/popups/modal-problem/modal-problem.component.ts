import { Component, OnInit, Input } from '@angular/core';
import { RegEx } from 'src/app/common/config';
import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';
declare var $: any;

@Component({
  selector: 'app-modal-problem',
  templateUrl: './modal-problem.component.html',
  styleUrls: ['./modal-problem.component.scss']
})
export class ModalProblemComponent implements OnInit {
  @Input() data: { title: string; problem: string; email: string } = {
    title: '',
    problem: '',
    email: ''
  };
  regex: any;
  twistData: { message: string } = { message: '' };
  subscription: any;
  constructor(
    private apiService: ApiService,
    private alertService: AlertService
  ) {
    this.regex = RegEx;
  }

  ngOnInit() {}

  sendMessage() {
    this.alertService.success('Feedback Received.');
    $('#problem-modal').modal('hide');
    // $('#problem-modal').modal('hide');
    this.apiService.sendMessage(this.data).subscribe(
      result => {
        // console.log(result);
        this.alertService.success('Email Received.');
      },
      error => {
        console.log(error);
        this.alertService.error('SMTP server not found.');
        this.apiService
          .logMessage(JSON.stringify(this.data))
          .subscribe(resp => {
            this.alertService.info('Feedback logged.');
          });
      }
    );
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
