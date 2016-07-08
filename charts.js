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

function drawChart(chartx,charts)
{
  var svgns = "http://www.w3.org/2000/svg";
  var ix;
  var jump = 500/chartx.no_ticks;
  var jx = 0;

  var iy;
  var jumpy = 200/Math.ceil((charts.cmax - charts.min) / charts.cdiv) + 1;
  var jy = 280;

  var yval = charts.value.yvalues;
  var exteremeypix;
  var pxrange;

  //console.log("jump x : " + jump);
  //console.log("jump y : " + jumpy);
  //console.log("y values : " + yval);

  //for(i = 0 ; i <)

  var svg = document.createElementNS(svgns, "svg");
  svg.setAttributeNS(null,"height","340");
  svg.setAttributeNS(null,"width","700");

  var xline = document.createElementNS(svgns, "line");
  xline.setAttribute("x1", 50);
  xline.setAttribute("y1", 260);
  xline.setAttribute("x2", 550);
  xline.setAttribute("y2", 260);
  xline.setAttribute("stroke", "#4d4d33");

  var yline = document.createElementNS(svgns, "line");
  yline.setAttribute("x1", 50);
  yline.setAttribute("y1", 260);
  yline.setAttribute("x2", 50);
  yline.setAttribute("y2", 2);
  yline.setAttribute("stroke", "#003d99");

  /*var plot = document.createElementNS(svgns, "circle");
          plot.setAttribute("cx", 125);
          plot.setAttribute("cy", 229);
          plot.setAttribute("r", 5);
          plot.setAttribute("fill", "green");
          plot.setAttribute("stroke", "green");
          svg.appendChild(plot);*/

  
  for(iy = 0 ; iy <= Math.ceil((charts.cmax - charts.min) / charts.cdiv) ; iy++)
  {
          var min = charts.cmin;
          var add = charts.cdiv;
          
          var ytick = document.createElementNS(svgns, "line");
          ytick.setAttribute("x1", 50);
          ytick.setAttribute("y1", jy-jumpy);
          ytick.setAttribute("x2", 45);
          ytick.setAttribute("y2", jy-jumpy);
          ytick.setAttribute("stroke", "green");
          svg.appendChild(ytick);

          var divline = document.createElementNS(svgns, "line");
          divline.setAttribute("x1", 50);
          divline.setAttribute("y1", jy-jumpy);
          divline.setAttribute("x2", 550);
          divline.setAttribute("y2", jy-jumpy);
          divline.setAttribute("stroke", "#e6ccb3");
          svg.appendChild(divline);

          var text = document.createElementNS(svgns, "text");
          text.setAttribute('x', 40);
          text.setAttribute('y', jy-jumpy);
          text.setAttribute('fill', '#000');
          text.setAttribute("text-anchor", "end");
          text.textContent = min + (add * iy);
          svg.appendChild(text);

          exteremeypix = jy - jumpy;
          jy -= jumpy;


  }

  jy = 230;

  pxrange = jy - exteremeypix;
  valrange = charts.cmax - charts.cmin;
  scale = pxrange / valrange;

  var prevx = 0;
  var prevy = 0;

  console.log("range : " + pxrange);
  console.log("val range : " + valrange + "    " +  "scale : " + scale);
  //X-Axis ticks
  for(ix = 0 ; ix < chartx.no_ticks ; ix++)
  {
          

          var xtick = document.createElementNS(svgns, "line");
          xtick.setAttribute("x1", jx+jump);
          xtick.setAttribute("y1", 260);
          xtick.setAttribute("x2", jx+jump);
          xtick.setAttribute("y2", 265);
          xtick.setAttribute("stroke", "#140d06");
          svg.appendChild(xtick);

          var point = document.createElementNS(svgns, "circle");
          point.setAttribute("cx", jx+jump);
          point.setAttribute("cy", jy - (yval[ix] - charts.cmin) * scale);
          point.setAttribute("r", 5);
          point.setAttribute("fill", "green");
          point.setAttribute("stroke", "#140d06");
          svg.appendChild(point);

          if(prevx != 0 && prevy != 0)
          {
            var connect = document.createElementNS(svgns, "line");
            connect.setAttribute("x1", prevx);
            connect.setAttribute("y1", prevy);
            connect.setAttribute("x2", jx+jump);
            connect.setAttribute("y2", jy - (yval[ix] - charts.cmin) * scale);
            connect.setAttribute("stroke", "green");
            svg.appendChild(connect);
          }

          var text = document.createElementNS(svgns, "text");
          text.setAttribute('x', jx+jump);
          text.setAttribute('y', 280);
          text.setAttribute('fill', '#000');
          text.setAttribute("text-anchor"," middle");
          text.textContent = chartx.value[ix];
          svg.appendChild(text);

          prevx = jx+jump;
          prevy = jy - (yval[ix] - charts.cmin) * scale;

          jx += jump;
  }

  //var shape = document.createElementNS(svgns, "div");
  
  /*var shape = document.createElementNS(svgns, "circle");
  shape.setAttribute("cx", 100);
  shape.setAttribute("cy", 100);
  shape.setAttribute("r",  100);
  shape.setAttribute("fill", "green");*/

  svg.appendChild(xline);
  svg.appendChild(yline);
  //svg.appendChild(xtick);

  var myDiv = document.createElement("div");
  //myDiv.setAttribute("id","div1");
  myDiv.appendChild(svg);
  //document.getElementById("div1").appendChild(svg);
  document.getElementById("chart-container").appendChild(myDiv);
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

          //console.log("Actual json");
          //console.log(xmlhttp.responseText);
          //console.log("Fetched json");
          //console.log(json);

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
          for(i = 0 ; i < no_charts ; i++)
          {
                  cal_min_max(charts[i]);
                  drawChart(chartx,charts[i]);
          }
          //cal_min_max(charts[1]);
          //cal_min_max(charts[2]);
          //cal_min_max(charts[3]);
          //plot(chartx,charts[0]);
          
          //drawChart(chartx,charts[1]);
          //drawChart(chartx,charts[2]);
          //drawChart(chartx,charts[3]);
        }
    }
}

xmlhttp.open('GET','structure.json',true);
xmlhttp.send();