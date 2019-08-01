import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ChartingService {
  getXAxisLabel(obj: any) {
    const keys = Object.keys(obj);
    return keys[0];
  }
  getYAxisLabels(obj: any) {
    const keys = Object.keys(obj);
    keys.shift();
    return keys;
  }

  getMinValue(data) {
    let min = 99999999999999999999999;
    const keys = Object.keys(data);
    keys.forEach(k => {
      const m = Math.min(...data[k].map(d => d.y));
      min = min > m ? m : min;
    });
    return min;
  }

  getMaxValue(data) {
    let max = 0;
    const keys = Object.keys(data);
    keys.forEach(k => {
      const m = Math.max(...data[k].map(d => d.y));
      max = max < m ? m : max;
    });
    return max;
  }

  color: any;
  getRandomColor() {
    this.color = '#';
    this.AddDigitToColor(5);
    for (var i = 0; i < 5; i++) {
      this.AddDigitToColor(15);
    }
    return this.color;
  }

  AddDigitToColor(limit: number) {
    const letters = '0123456789ABCDEF'.split('');
    this.color += letters[Math.round(Math.random() * limit)];
  }

  getColor(dark: boolean, idx: number) {
    const colors = {
      dark: [
        '#ff0000',
        '#000000',
        '#065535',
        '#ff80ed',
        '#ffa500',
        '#0000ff',
        '#800000',
        '#003366',
        '#fa8072',
        '#ffb6c1',
        '#ffd700',
        '#800080',
        '#00ff00',
        '#f08080',
        '#c0c0c0',
        '#20b2aa',
        '#666666',
        '#c39797',
        '#133337',
        '#008080',
        '#40e0d0',
        '#ff6666'
      ],
      light: [
        '#ffc0cb',
        '#ffe4e1',
        '#e6e6fa',
        '#00ffff',
        '#d3ffce',
        '#f0f8ff',
        '#b0e0e6',
        '#c6e2ff',
        '#faebd7',
        '#7fffd4',
        '#eeeeee',
        '#cccccc',
        '#ffc3a0',
        '#fff68f'
      ]
    };
    return colors[dark ? 'dark' : 'light'][idx];
    // return colors[dark ? 'dark' : 'light'][
    //   Math.round(Math.random() * colors[dark ? 'dark' : 'light'].length)
    // ];
  }

  getChartData() {
    const data$ = new BehaviorSubject<any[]>([]);
    // return this.api.getChartData(data$);
  }
  constructor(private api: ApiService) {}
}
