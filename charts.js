var xmlhttp = new XMLHttpRequest(),json;
loadChartData();

var chartDetails=function(a,b)
{
  this.caption=a;
  this.subCaption=b;
}

var chartxAxis = function(a,b,no)
{
  this.label=a;
  this.value=b;
  this.no_ticks=no;
}

var chartyAxis = function(a,b,min,max)
{
  this.label=a;
  this.value=b;
  this.min=min;
  this.max=max;
  this.range=max - min;
  this.cmin=0;
  this.cmax=0;
  this.cdiv=0;
}

function cal_min_max(charty)
{
  
  var pad = Math.ceil((5 * charty.range) / 100);
  charty.cmin = parseFloat(charty.min) - pad;
  charty.cmax = parseFloat(charty.max) + pad;
  charty.cdiv = Math.ceil((20 * (charty.cmax - charty.cmin)) / 100);
  console.log("Calculated min max : " + charty.cmin + "    " + charty.cmax + "    " + charty.cdiv + "    " + pad);
  console.log("And then : " + typeof(charty.range));
}

function loadChartData()
{
    xmlhttp.onreadystatechange = function()
    {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          json = JSON.parse(xmlhttp.responseText);

          console.log("Actual json");
          console.log(xmlhttp.responseText);
          console.log("Fetched json");
          console.log(json);

          var data = document.getElementById("showData");

          data.innerHTML = 'Chart Loaded <br> The Caption  of the chart is : ' + json.chartCaption + '<br>';
          data.innerHTML += 'The sub caption of the chart is : ' + json.chartSubCaption + '<br>';


          //Chart caption and sub caption
          var chartnames = new chartDetails(json.chartCaption,json.chartSubCaption);
          //console.log(chartnames);
                    

          //Chart details of x-axis
          var temp = [];
          var i;
          var no = Object.keys(json.xdata).length;

          for(i = 0 ; i < no ; i++)
          {
                    temp[i] = json.xdata[i];
          }
          var chartx = new chartxAxis(json.xAxisLabel, temp, no);


          //Chart details of y-axis
          var charts = new Array();
          var temp1 = [];
          var j;
          var no_charts = Object.keys(json.yAxisLabel).length;

          for(i = 0 ; i < no_charts ; i++)
          {                
                    var ylabel = json.yAxisLabel[i];
                    temp1 = json.ydata[i];

                    var min = temp1.yvalues[0];
                    var max = temp1.yvalues[0];
                    
                    for(j = 0 ; j < temp1.yvalues.length ; j++)
                    {
                      if(temp1.yvalues[j] < min)
                        min = temp1.yvalues[j];
                      if(temp1.yvalues[j] > max)
                        max = temp1.yvalues[j];
                    }

                    charts[i] = new chartyAxis(ylabel, temp1, min, max);
          }
          console.log("Parsed Internal Data from Fetched Data");
          console.log(chartnames);
          console.log(chartx);
          console.log(charts);

          //call functions
          cal_min_max(charts[0]);
          cal_min_max(charts[1]);
          cal_min_max(charts[2]);
          cal_min_max(charts[3]);
        }
    }
}

xmlhttp.open('GET','structure.json',true);
xmlhttp.send();