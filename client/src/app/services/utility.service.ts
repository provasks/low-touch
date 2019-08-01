import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  // toastMessege() {
  //   window.setTimeout(function() {
  //     $('.alert')
  //       .fadeTo(500, 0)
  //       .slideUp(500, function() {
  //         // $(this).remove();
  //         $(this).css('visibility', 'hidden');
  //       });
  //   }, 2000);
  // }
  constructor() {}
  /*********************************************/
  /* Method to convert data to JSON if not
  /* already in JSON format
  /*********************************************/
  checkJSON(data) {
    if (typeof data !== 'object') {
      data = JSON.parse(data);
    }
    return data;
  }
}
