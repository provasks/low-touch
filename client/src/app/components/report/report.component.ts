import { Component, OnInit } from '@angular/core';
import { System } from 'src/app/models/system.model';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AlertService } from 'src/app/services/alert.service';
import { Settings } from 'src/app/common/config';
declare var $: any;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  host: System;
  modalData: any = { title: '' };
  cluster_uuid: any;
  sys_serial_number: any;
  hostname: any;
  notification: { message: string } = { message: '' };
  dataSubscription: any;
  messageSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private util: UtilityService,
    private alertService: AlertService
  ) {
    this.notification.message = '';
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }
  //http://bl.ocks.org/Matthew-Weber/5645518
  ngOnInit() {
    this.cluster_uuid = this.route.snapshot.params['cluster_uuid'];
    this.sys_serial_number = this.route.snapshot.params['sys_serial_number'];
    this.hostname = this.route.snapshot.params['hostname'];

    this.dataSubscription = this.apiService
      .getReportDetails(
        this.cluster_uuid,
        this.sys_serial_number,
        this.hostname
      )
      .subscribe(data => {
        this.host = data;
      });
  }

  sendFeedback(type: string, aggrName?: string, hostname?: string) {
    const data = {
      type: type,
      uuid: this.cluster_uuid,
      serial: this.sys_serial_number,
      hostname: hostname,
      aggr: aggrName
    };
    this.messageSubscription = this.apiService.updateReview(data).subscribe(
      resp => {
         this.alertService.info('Feedback logged.');
      },
      error => this.alertService.error(Settings.API_PATH + ' is not running!')
    );
  }

  showPopup(type: string, aggrName?: string) {
    this.modalData = {
      title: `Problem reported on ${type}`,
      email: '',
      problem: '',
      cluster: this.cluster_uuid,
      serial: this.sys_serial_number,
      host: this.hostname,
      aggregate: aggrName,
      hostUrl: location.href,
      siteUrl: location.origin + '/index.html',
      date: new Date().toLocaleString()
    };

    $('#problem-modal').modal({
      backdrop: 'static',
      keyboard: false
    });
  }
}
