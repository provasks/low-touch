import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { ChartingService } from 'src/app/services/charting.service';
import { Charting, Settings } from 'src/app/common/config';

@Component({
  selector: 'app-chart',
  encapsulation: ViewEncapsulation.None, //helps to use the css class for SVG
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  _aggregate: any;
  xScale: any;
  yScale: any;
  xAxis: any;
  yAxis: any;
  tooltipDiv: any;
  svg: any;
  tooltip: any;
  @Input()
  set aggregate(config: any) {
    this._aggregate = config || {};
  }
  get aggregate() {
    return this._aggregate;
  }

  marginLegend: number = 5;
  lineSelection: any;
  svgSelection: any;

  constructor(private chartingService: ChartingService) {}

  ngOnInit() {
    this.tooltip = d3.select('.tooltip').style('opacity', 0);
  }

  ngAfterViewInit() {
    this.svg = d3
      .select('.' + this.aggregate.aggr_name)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('height', Charting.svg.height || 400)
      .attr('width', Charting.svg.width || 600);

    const xLabel = 'timestamp';
    const thresholdLine = 'Threshold';
    const chartData: any = {}; //coordinates of distinct lines will be stored
    chartData[thresholdLine] = []; //initialize array for threshold line
    this.aggregate['capacity_forecast'].forEach(data => {
      const yLabels = Object.keys(data).filter(e => e != xLabel); //legend for diffent lines except xAxis label (timestamp)
      yLabels.forEach(key => {
        if (!chartData[key]) {
          chartData[key] = []; //initialize array for different lines
        }
        chartData[key].push({ x: new Date(data[xLabel]), y: +data[key] }); //load points for diffrent lines
        chartData[thresholdLine].push({
          x: new Date(data[xLabel]),
          y: +Charting.chart.thresholdValue
        }); //load points for threshold
      });
    });
    const legends = Object.keys(chartData);
    const xAxisData = this.aggregate['capacity_forecast'].map(d => {
      return { x: new Date(d[xLabel]) };
    });

    const title = Charting.chart.title || '';
    const xAxisLabel = Charting.chart.axisLabel.xAxis;
    const yAxisLabel = Charting.chart.axisLabel.yAxis;

    const xValue = d => d.x;
    const yValue = d => d.y;

    const circleRadius = 6;

    // const margin = { top: 60, right: 40, bottom: 88, left: 105 };
    const innerWidth =
      Charting.svg.width - Charting.svg.margin.left - Charting.svg.margin.right;
    const innerHeight =
      Charting.svg.height -
      Charting.svg.margin.top -
      Charting.svg.margin.bottom;

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(xAxisData, xValue))
      .range([0, innerWidth])
      .nice();

    const g = this.svg
      .append('g')
      .attr(
        'transform',
        `translate(${Charting.svg.margin.left},${Charting.svg.margin.top})`
      );

    // const zoomed = () => {
    //   if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush
    //   var t = d3.event.transform;
    //   xScale.domain(t.rescaleX(xScale).domain());
    //   g.select('.line').attr('d', lineGenerator);
    //   g.focus.select('.axis--x').call(xAxis);
    //   g.context
    //     .select('.brush')
    //     .call(d3.brush.move, xScale.range().map(t.invertX, t));
    // };

    // var zoom = d3
    //   .zoom()
    //   .scaleExtent([1, Infinity])
    //   .translateExtent([
    //     [0, 0],
    //     [Charting.svg.width, Charting.svg.height]
    //   ])
    //   .extent([[0, 0], [Charting.svg.width, Charting.svg.height]])
    //   .on('zoom', zoomed);

    // const brushed = () => {
    //   if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
    //   var s = d3.event.selection || xScale.range();
    //   xScale.domain(s.map(xScale.invert, xScale));
    //   g.select('.line').attr('d', lineGenerator);
    //   g.focus.select('.axis--x').call(xAxis);
    //   g.select('.zoom').call(
    //     zoom.transform,
    //     d3.zoomIdentity
    //       .scale(Charting.svg.width / (s[1] - s[0]))
    //       .translate(-s[0], 0)
    //   );
    // };

    g.append('text')
      .attr('class', 'title')
      .attr('y', -10)
      .text(title);

    const xAxis = d3
      .axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(15);
    const xAxisG = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text') //xAxis label rotation
      .attr('y', 6)
      .attr('x', 3)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(35)')
      .style('text-anchor', 'start');

    xAxisG.select('.domain').remove();

    xAxisG
      .append('text')
      .attr('class', 'axis-label')
      .attr('y', Charting.chart.axisLabelDistance + 10)
      .attr('x', innerWidth / 2)
      .attr('fill', 'black')
      .text(xAxisLabel);

    const yMax = this.chartingService.getMaxValue(chartData);
    const yScale = d3
      .scaleLinear()
      .domain([
        // this.chartingService.getMinValue(chartData),
        0,
        yMax < 100 ? 100 : yMax //Y-Axis mamimum value should be at least 100
      ])
      // .domain([0, 300])
      .range([innerHeight, 0])
      .nice();

    const yAxis = d3
      .axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickPadding(10);

    const yAxisG = g.append('g').call(yAxis);
    yAxisG.selectAll('.domain').remove();

    yAxisG
      .append('text')
      .attr('class', 'axis-label')
      .attr('y', -Charting.chart.axisLabelDistance)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'black')
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
      .text(yAxisLabel);

    const lineGenerator = d3
      .line()
      .x(d => xScale(xValue(d)))
      .y(d => yScale(yValue(d)));

    legends.forEach((legend, i) => {
      // .curve(d3.curveBasis);

      const legendColor = this.chartingService.getColor(true, i);
      g.append('path')
        .attr('class', legend === thresholdLine ? thresholdLine : 'line-path')
        .attr('id', legend)
        .style('stroke', legendColor)
        .style('stroke-dasharray', legend === thresholdLine ? '2, 2' : '0,0') // <== This line here!!
        .attr('d', lineGenerator(chartData[legend]));
      g;

      this.createLegend(legendColor, 'abc', legend, innerWidth + 80);
    });
  }

  // method to create legend
  createLegend(legendColor, lineId, legendText, legendX) {
    const rectangle = this.svg.append('g');
    // const left = Charting.svg.width - Charting.chart.lineLabel.width;
    // const left = Charting.svg.width - Charting.chart.lineLabel.width;
    const top =
      Charting.svg.margin.top +
      Charting.chart.lineLabel.height +
      this.marginLegend;
    rectangle
      .append('rect')
      .attr('width', Charting.chart.lineLabel.width)
      .attr('height', Charting.chart.lineLabel.height)
      .attr('class', `legend ${legendText}`)
      .attr('x', legendX)
      .attr('y', top)
      .attr('stroke', legendColor)
      .on('mouseover', () => {
        d3.selectAll('.' + this.aggregate.aggr_name + ' .line-path').style(
          'stroke-width',
          '1'
        );
        d3.select('.' + this.aggregate.aggr_name + ' #' + legendText).style(
          'stroke-width',
          '5'
        );
        // .style('opacity', '0');
        this.tooltip
          .transition()
          .duration(500)
          .style('opacity', 0.65);
        this.tooltip
          .html(Charting.chart.legend[legendText].tooltip)
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY + 20 + 'px');
      })
      .on('mousemove', () => {
        this.tooltip
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY + 20 + 'px');
      })
      .on('mouseout', () => {
        d3.selectAll('.' + this.aggregate.aggr_name + ' .line-path').style(
          'stroke-width',
          '2'
        );
        d3.select('.' + this.aggregate.aggr_name + ' #' + legendText).style(
          'stroke-width',
          '2'
        );
        this.tooltip
          .transition()
          .duration(500)
          .style('opacity', 0);
      })
      .attr('fill', legendColor)
      .attr('stroke-width', 1)
      .transition()
      .duration(600)
      .style('opacity', 1);

    const legend = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' +
          (legendX + Charting.chart.lineLabel.width + 5) +
          ',' +
          (top + Charting.chart.lineLabel.height / 2 + 5) +
          ')'
      );
    legend
      .append('text')
      .attr('class', `legend ${legendText}`)
      .attr('text-anchor', 'start')
      .style('text-transform', 'capitalize')
      .text(Charting.chart.legend[legendText].text || legendText);
    // .attr('class', 'legend')
    // .attr('x', legendX)
    // .attr('y', top)
    // .attr('font-family', 'sans-serif')
    // .style('cursor', 'pointer')
    // .attr('font-size', '12px')
    // .attr('fill', 'white')
    // .attr(
    //   'transform',
    //   'translate(' +
    //     (Charting.svg.width + this.marginLegend) / 1.3 +
    //     ',' +
    //     Charting.svg.margin.top +
    //     ')'
    // )
    // .on('click', () => {
    //   var opacity = d3.select('.' + lineId).style('opacity') == 1 ? 0 : 1;
    //   d3.select('.' + lineId)
    //     .transition()
    //     .duration(500)
    //     .style('opacity', opacity);
    // });
    this.marginLegend += Charting.chart.lineLabel.height + 5;
  }

  drawPoints(pointData, pointColor, onLine) {
    // create points for line
    onLine
      .selectAll('.points')
      .data(pointData)
      .enter()
      .append('svg:circle')
      .style('cursor', 'pointer')
      .attr('stroke', pointColor)
      .attr('fill', (d, i) => pointColor)
      .attr('cx', (d, i) => this.xScale(d.year))
      .attr('cy', (d, i) => this.yScale(d.sale))
      .attr('r', (d, i) => 3)
      .on('mouseover', d => {
        // animate point useful when we have points ploted close to each other.
        d3.select(this)
          .transition()
          .duration(300)
          .attr('r', 6);

        // code block for tooltip
        this.tooltipDiv
          .transition()
          .duration(200)
          .style('opacity', 0.9);
        this.tooltipDiv
          .html(d.year + ' : ' + d.sale)
          .style('background', pointColor)
          .style('left', d3.event.pageX - 30 + 'px')
          .style('top', d3.event.pageY - 40 + 'px');
      })
      .on('mouseout', d => {
        // animate point back to origional style
        d3.select(this)
          .transition()
          .duration(300)
          .attr('r', 3);

        this.tooltipDiv
          .transition()
          .duration(500)
          .style('opacity', 0);
      });
  }

  drawLine(lineData, lineColor, lineLabel, lineId) {
    // append line to svg
    const group = this.svgSelection.append('g').attr('class', lineId);

    group
      .append('svg:path')
      .attr('d', this.lineSelection(lineData))
      .attr('stroke', lineColor)
      .attr('stroke-width', 1)
      .attr('fill', 'none');

    return group;
  }
}
