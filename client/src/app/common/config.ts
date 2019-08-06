export const RegEx = {
  email: '[a-z]+[a-z0-9._]+@[a-z]+.[a-z.]{2,5}'
};

export const Settings = {
  API_PATH: 'http://localhost:3011/api'
  // API_PATH: 'http://10.103.165.10:3011/api'
};

// chart configuration
export const Charting = {
  chart: {
    title: 'Capacity Forecast',
    axisLabel: {
      xAxis: 'Week',
      yAxis: 'Used Capacity (%)'
    },
    lineLabel: {
      height: 15,
      width: 15
    },
    thresholdValue: 90,
    axisLabelDistance: 40,
    legend: {
      Threshold: {
        text: 'Threshold',
        tooltip: 'Threshold'
      },
      Data: {
        text: 'Historic Capacity Usage',
        tooltip: 'Historic Capacity Usage'
      },
      Holt_Linear_Forecast: {
        text: 'Linear Forecast',
        tooltip: 'Linear Forecast'
      },
      Holt_Winters_a: {
        text: '2 Weeks Seasonality',
        tooltip:
          'Using one year historical data with 2 weeks as seasons to forecast for the next 6 months.'
      },
      Holt_Winters_b: {
        text: '4 Weeks Seasonality',
        tooltip:
          'Using one year historical data with 4 weeks as seasons to forecast for the next 6 months.'
      },
      Holt_Winters_c: {
        text: '6 Weeks Seasonality',
        tooltip:
          'Using one year historical data with 6 weeks as seasons to forecast for the next 6 months.'
      }
    }
  },
  svg: {
    id: 'mySvg',
    width: 1000,
    height: 450,
    margin: {
      top: 35,
      right: 250,
      bottom: 60,
      left: 70
    }
  }
};
