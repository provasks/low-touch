import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { Alert, AlertType } from 'src/app/models/alert.model';
declare var $: any;

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  alerts: Alert[] = [];
  subscription: any;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService
      .getAlert()
      .subscribe((alert: Alert) => {
        if (!alert) {
          // clear alerts when an empty alert is received
          this.alerts = [];
          return;
        }
        const self = this;
        window.setTimeout(function() {
          self.removeAlert(alert);
        }, 5000);

        // add alert to array
        this.alerts.push(alert);
      });
  }

  removeAlert(alert: Alert) {
    // $('div[id="alert_' + this.alerts.indexOf(alert) + '"]').fadeOut('slow'); //with animation effect
    // this.alerts = this.alerts.filter(x => x !== alert); //without animation
  }

  getAlertClass(alert: Alert) {
    if (!alert) {
      return;
    }

    // return css class based on alert type
    switch (alert.type) {
      case AlertType.Success:
        return 'alert alert-success';
      case AlertType.Error:
        return 'alert alert-danger';
      case AlertType.Info:
        return 'alert alert-info';
      case AlertType.Warning:
        return 'alert alert-warning';
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
