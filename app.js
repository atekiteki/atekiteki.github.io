// Initialize Firebase
var config = {
    apiKey: 'AIzaSyC6x1ztgCLZr8B5xt8zAW2iQYi9xKEPHkA',
    authDomain: 'fast-rune-203211.firebaseapp.com',
    databaseURL: 'https://fast-rune-203211.firebaseio.com',
    projectId: 'fast-rune-203211',
    storageBucket: 'fast-rune-203211.appspot.com',
    messagingSenderId: '85319991090'
  }
  firebase.initializeApp(config)
  var db = firebase.firestore()
  const settings = { timestampsInSnapshots: true }
  db.settings(settings)
  db.enablePersistence().catch(function(err) {
    if (err.code == 'failed-precondition') {
    } else if (err.code == 'unimplemented') {
    }
    console.error('Failed to enable persistence:', err)
  })
  
  window.retrieveData = function() {
    var conditions = db.collection('conditions')
    return conditions
      .orderBy('createdAt', 'desc')
      .limit(300)
      .get()
      .then(querySnapshot => {
        var items = []
        querySnapshot.forEach(doc => {
          items.push(doc.data())
        })
        items = items.map(item => {
          return Object.assign({}, item, {
            temperature: item.temperature - 1.4,
            humidity: item.humidity + 8.2
          })
        })
        return items.reverse()
      })
  }
  
  window.renderChart = function(items) {
    const lastItem = items[items.length - 1]
  
    const basicOptions = {
      time: {
        timezone: 'Asia/Tokyo'
      },
      xAxis: {
        type: 'datetime'
      },
  
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
  
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          pointStart: 2010
        }
      },
  
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }
        ]
      },
  
      theme: {
        chart: {
          backgroundColor: {
            linearGradient: { x1: 0, x2: 1, y1: 0, y2: 1 },
            stops: [[0, '#2a2a2b'], [1, '#2a2a2b']]
          }
        }
      }
    }
  
    Highcharts.theme.chart.backgroundColor = {
      linearGradient: { x1: 0, x2: 1, y1: 0, y2: 1 },
      stops: [[0, '#2a2a2b'], [1, '#2a2a2b']]
    }
    Highcharts.setOptions(Highcharts.theme)
  
    Highcharts.chart(
      'temperature',
      Object.assign({}, basicOptions, {
        title: {
          useHTML: true,
          text:
            '<i class="thermometer icon"></i> Temperature: ' +
            lastItem.temperature.toString().substr(0, 4) +
            ' ℃'
        },
        yAxis: {
          title: {
            text: '℃'
          }
        },
        series: [
          {
            showInLegend: false,
            name: 'Temperature',
            data: items.map(item => [
              item.createdAt.seconds * 1000,
              item.temperature
            ])
          }
        ]
      })
    )
  
    Highcharts.chart(
      'humidity',
      Object.assign({}, basicOptions, {
        title: {
          useHTML: true,
          text:
            '<i class="tint icon"></i> Humidity: ' +
            lastItem.humidity.toString().substr(0, 4) +
            ' %rh'
        },
        yAxis: {
          title: {
            text: '%rh'
          }
        },
        series: [
          {
            showInLegend: false,
            name: 'Humidity',
            data: items.map(item => [
              item.createdAt.seconds * 1000,
              item.humidity
            ])
          }
        ]
      })
    )
  
    Highcharts.chart(
      'pressure',
      Object.assign({}, basicOptions, {
        title: {
          useHTML: true,
          text:
            '<i class="sun icon"></i> Pressure: ' +
            Math.round(lastItem.pressure) +
            ' hPa'
        },
        yAxis: {
          title: {
            text: 'hPa'
          }
        },
        series: [
          {
            showInLegend: false,
            name: 'Pressure',
            data: items.map(item => [
              item.createdAt.seconds * 1000,
              item.pressure
            ])
          }
        ]
      })
    )
  
    Highcharts.chart(
      'light',
      Object.assign({}, basicOptions, {
        title: {
          useHTML: true,
          text: '<i class="lightbulb icon"></i> Light: ' + lastItem.light + ' lux'
        },
        yAxis: {
          title: {
            text: 'Lux'
          }
        },
        series: [
          {
            showInLegend: false,
            name: 'Light',
            data: items.map(item => [item.createdAt.seconds * 1000, item.light])
          }
        ]
      })
    )
  }