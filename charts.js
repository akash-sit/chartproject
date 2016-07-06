var xmlhttp = new XMLHttpRequest(),json;
loadChartData();

var chartDetails=function(a,b)
{
  this.caption=a;
  this.subCaption=b;
}

var chartxAxis = function(a,b)
{
  this.label=a;
  this.value=b;
}

var chartyAxis = function(a,b)
{
  this.label=a;
  this.value=b;
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
      var temp = [];
      var temp1 = [];


      //Chart details of x-axis
      var i;
      var no = Object.keys(json.xdata).length;
      for(i = 0 ; i < no ; i++)
      {
                temp[i] = json.xdata[i];
      }
      var chartx = new chartxAxis(json.xAxisLabel, temp);


      //Chart details of y-axis
      var charts = new Array();
      var no_charts = Object.keys(json.yAxisLabel).length;
      for(i = 0 ; i < no_charts ; i++)
      {        
                var ylabel = json.yAxisLabel[i];
                temp1 = json.ydata[i];
                
                charts[i] = new chartyAxis(ylabel, temp1);
      }
      console.log("Parsed Internal Data from Fetched Data");
      console.log(chartnames);
      console.log(chartx);
      console.log(charts);
    }
}
}


xmlhttp.open('GET','structure.json',true);
xmlhttp.send();