import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-laser',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './laser.component.html',
  styleUrls: ['./laser.component.scss']
})
export class LaserComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    const w = 400; //d3.select('.laser').innerWidth;
    const h = 400;

    const svg = d3
      .select('.laser')
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .attr('id', 'visualization');

    const x = d3
      .scaleLinear()
      .domain([0, 10])
      .range([0, w]);
    const y = d3
      .scaleLinear()
      .domain([0, 12])
      .range([30, h - 30]);

    const line = d3
      .line()
      .x((d, i) => {
        return x(i);
      })
      .y(d => {
        return y(d);
      })
      .curve(d3.curveNatural);

    // data is created inside the function so it is always unique
    const repeat = () => {
      const data = d3.range(11).map(() => {
        return Math.random() * 10;
      });

      // Uncomment following line to clear the previously drawn line
      //svg.selectAll("path").remove();

      // Set a light grey class on old paths
      // svg.selectAll('path').attr('class', 'old');

      const path = svg
        .append('path')
        .attr('d', line(data))
        .attr('stroke', 'green')
        .attr('stroke-width', '3')
        .attr('fill', 'none');

      const totalLength = path.node().getTotalLength();

      path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(4000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)
        .on('end', () => {
          path.attr('stroke', 'darkgray').attr('stroke-width', '1');
          repeat();
        });
      path
        .on('mouseover', () => {
          path.attr('stroke', 'red').attr('stroke-width', '2');
        })
        .on('mouseout', () => {
          path.attr('stroke', 'darkgray').attr('stroke-width', '1');
        });
    };
    repeat();
  }
}
