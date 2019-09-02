import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ViewEncapsulation } from '@angular/core';
import { Point } from '../models/point.model';
import { Pattern } from '../models/pattern.model';
declare var $: any;

@Component({
  selector: 'app-pattern',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss']
})
export class PatternComponent implements OnInit {
  svg: any;

  patternIndex = 0;
  completed: boolean = true;
  speed = 5; //Drawing speed

  line: any;
  R: number;
  r: number;
  d: number;
  C: Point;
  canvas = { width: 0, height: 0 };
  strokeColor = '#0000ff';
  backColor = '#000000';
  stop: boolean = false;
  path: any;
  patterns: Array<Pattern> = [];
  constructor() {
    // http://mathworld.wolfram.com/Hypotrochoid.html
    // this.stop.subscribe(()=>{
    // })
  }

  ngAfterContentInit() {
    this.canvas.width = $('div.canvas').innerWidth() - 30;
    this.canvas.height = this.canvas.width;
    this.C = {
      //Center of Outer Circle
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    };
    this.R = Math.ceil(this.canvas.width / 2); // Radius of Outer Circle
    this.r = 70; // Radius of Inner Circle
    this.d = 37; // Radius of Drawing Circle
    var svg = d3
      .select('.canvas')
      .append('svg')
      .style('background-color', this.backColor)
      .attr('width', this.canvas.width)
      .attr('height', this.canvas.height)
      .attr('id', 'visualization')
      .call(
        d3.zoom().on('zoom', function() {
          svg.attr('transform', d3.event.transform);
        })
      )
      .append('g');
    this.svg = svg;

    const xValue = (d: Point) => d.x;
    const yValue = (d: Point) => d.y;

    // const xAxisData = data.map(d => {
    //   return d.x;
    // });
    // const yAxisData = data.map(d => {
    //   return d.y;
    // });
    // const x = d3
    //   .scaleLinear()
    //   .domain(d3.extent(xAxisData, xValue))
    //   .range([0, this.canvas.width]);
    // const y = d3
    //   .scaleLinear()
    //   .domain(d3.extent(yAxisData, yValue))
    //   .range([0, this.canvas.height]);

    this.line = d3
      .line()
      .x((d: Point) => xValue(d))
      .y((d: Point) => yValue(d))
      .curve(d3.curveNatural);

    // repeat();
    // this.drawPattern();
  }
  getData(R: number, r: number, d: number) {
    const data = [];
    const interval = 5;
    const clearance = 0.1;
    // const outerCircle = this.drawOuterCircle(R);
    // const innerCircle = this.drawInnerCircle(r);
    // this.drawCircle(this.CO.x - RO + RI + RD, this.CO.y);

    const startingPoint: Point = this.getPoint(0, R, r, d);
    data.push(startingPoint);
    for (let angle = interval; ; angle += interval) {
      // this.drawCircle(p.x, p.y);
      const p: Point = this.getPoint(angle, R, r, d);
      if (this.getDistance(startingPoint, p) <= clearance) {
        data.push(startingPoint);
        break;
      } else data.push(p);
    }
    return data;
  }

  getDistance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  getPoint(angle: number, R: number, r: number, d: number): Point {
    const rad = (Math.PI / 180) * angle;
    return {
      x: (R - r) * Math.cos(rad) + d * Math.cos(((R - r) * rad) / r) + this.C.x,
      y: (R - r) * Math.sin(rad) - d * Math.sin(((R - r) * rad) / r) + this.C.y
    };
  }

  drawInnerCircle(r) {
    //center
    this.drawCircle(this.C.x - this.R + r, this.C.y, 2, 'yellow', 'yellow');
    //circumference
    return this.drawCircle(this.C.x - this.R + r, this.C.y, r, 'red');
  }

  drawOuterCircle(r: number) {
    this.drawCircle(this.C.x, this.C.y, 2, 'yellow', 'yellow');
    return this.drawCircle(this.C.x, this.C.y, r, 'red');
  }

  drawCircle = (cx, cy, r = 2, borderColor = 'blue', fillColor = 'none') => {
    const circle = this.svg
      .append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', r)
      .style('stroke', borderColor)
      .style('fill', fillColor);

    return circle;
  };

  ngOnInit() {}

  drawPattern() {
    this.completed = false;
    this.patternIndex++;
    const data = this.getData(this.R, this.r, this.d);
    // this.speed = data.length / 50;
    this.path = this.getPath(data);
    this.draw(this.path);
    this.setEvents(this.path);
  }

  setEvents(path: any) {
    let color = '';
    path
      .on('mouseover', () => {
        color = path.attr('stroke');
        path.attr('stroke', 'white').attr('stroke-width', '1');
        // path.attr('stroke-width', '1');
      })
      .on('mouseout', () => {
        // path.attr('stroke-width', '1');
        path.attr('stroke', color).attr('stroke-width', '1');
      })
      .on('click', () => {
        path.attr('stroke', this.strokeColor);
      })
      .on('dblclick', () => {
        path.remove();
      });
  }
  draw(path: any) {
    const totalLength = path.node().getTotalLength();

    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(this.speed * 1000) //milisec
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)
      .on('end', () => {
        this.completed = true;
        this.patterns.push({
          R: this.R,
          r: this.r,
          d: this.d,
          color: this.strokeColor
        });
        // path.attr('stroke', 'darkgray').attr('stroke-width', '1');
        // repeat(i + 1);
      });
  }

  stopDrawing() {
    // this.stop = true;
    // d3.select(this.path).finish()
    d3.select(this.path).finish();
  }
  getPath(data: any[]) {
    return this.svg
      .append('path')
      .attr('id', 'pattern-' + this.patternIndex)
      .attr('d', this.line(data))
      .attr('stroke', this.strokeColor)
      .attr('stroke-width', '1')
      .attr('fill', 'none');
  }

  changeColor(color, index) {
    $('#pattern-' + index).css('stroke', color);
  }
  changeBackColor(color) {
    $('svg').css('background-color', color);
  }
}
