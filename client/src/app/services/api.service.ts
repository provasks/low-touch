import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from 'src/app/common/config';
import { UtilityService } from './utility.service';
import { of, config } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  getReportDetails(cluster_uuid: any, sys_serial_number: any, hostname: any) {
    return this.httpClient
      .get(
        Settings.API_PATH +
          `/outcomes/${cluster_uuid}/${sys_serial_number}/${hostname}`,
        {
          responseType: 'json'
        }
      )
      .pipe(map((response: any) => this.util.checkJSON(response)));
  }
  getHostsWithMatchingOutcome(filterText: any) {
    return this.httpClient
      .get(Settings.API_PATH + `/outcomes/${filterText}`, {
        responseType: 'json'
      })
      .pipe(map((response: any) => this.util.checkJSON(response)));
  }

  getDistinctOutcomes() {
    return this.httpClient
      .get(Settings.API_PATH + `/outcomes`, {
        responseType: 'json'
      })
      .pipe(map((response: any) => this.util.checkJSON(response)));
  }

  logMessage(msg: any) {
    return this.httpClient
      .post(
        Settings.API_PATH + `/logger/log`,
        { msg: msg },
        {
          responseType: 'json'
        }
      )
      .pipe(map((response: any) => this.util.checkJSON(response)));
  }
  updateReview(data: any) {
    return this.httpClient
      .put(
        Settings.API_PATH + `/outcomes/updateReview`,
        { data: data },
        {
          responseType: 'json'
        }
      )
      .pipe(map((response: any) => this.util.checkJSON(response)));
  }
  sendMessage(data: any) {
    return this.httpClient
      .post(
        Settings.API_PATH + `/mailer/send`,
        { msg: data },
        {
          responseType: 'json'
        }
      )
      .pipe(
        map((response: any) => {
          this.util.checkJSON(response);
        })
      );
  }
  constructor(
    private httpClient: HttpClient,
    private util: UtilityService
  ) {}

}
