var dps0 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var dps2017 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];;
var dps2018 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];;
var dps2019 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];;
var dps2020 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];;
async function getDps(params) {
  const res = await fetch('/api/deposit/chart');
  let data = await res.json();
  // console.log(data);
  await data.forEach(n => {
    switch (n._id.year) {
      case 2018:
        dps2018[n._id.month - 1] = n.total;

        break;
      case 2019:
        dps2019[n._id.month - 1] = n.total;
        break;
      case 2017:
        dps2017[n._id.month - 1] = n.total;
        break;

      default:
        break;
    }
  });
  console.log(dps2019);
  dps2019=dps2019.slice(0, new Date().getMonth()+1);
  console.log(dps2019);
  console.log(dps2018);
  console.log(dps2017);


  // Set new default font family and font color to mimic Bootstrap's default styling
  Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = '#858796';

  function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
      };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  }

  // Area Chart Example
  var ctx = document.getElementById("myAreaChart");
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "2019",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 5,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: dps2019,
        },
        {
          label: "2018",
          lineTension: 0.2,
          backgroundColor: "rgba(255, 0, 50, 0)",
          borderColor: "rgba(255, 0, 50, 1)",
          pointRadius: 3,
          pointBackgroundColor: "red",
          pointBorderColor: "red",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "red",
          pointHoverBorderColor: "red",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: dps2018,
        },
        {
          label: "2017",
          lineTension: 0.2,
          backgroundColor: "rgba(255, 0, 50, 0)",
          borderColor: "yellow",
          pointRadius: 3,
          pointBackgroundColor: "yellow",
          pointBorderColor: "black",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "yellow",
          pointHoverBorderColor: "yellow",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: dps2017,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'date'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 7
          }
        }],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: 5,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
                return 'BDT' + number_format(value);
              }
            },

            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2]
            }
          }],
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10,
        callbacks: {
          label: function (tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': BDT' + number_format(tooltipItem.yLabel);
          }
        }
      }
    }
  });
}
getDps()
