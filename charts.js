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
        }
    }
}

xmlhttp.open('GET','structure.json',true);
xmlhttp.send();