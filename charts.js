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



function drawChart(chartx,charts,index,no_charts)
{
  var svgns = "http://www.w3.org/2000/svg";
  var ix;
  var jump = 500/chartx.no_ticks;
  var jx = 50;

  var iy;
  var jumpy = 285/((charts.cmax - charts.cmin) / charts.cdiv);
  var jy = 300;

  var yval = charts.value.yvalues;
  var exteremeypix;
  var firstypix = 0;
  var pxrange;

  //console.log("jump x : " + jump);
  //console.log("jump y : " + jumpy);
  //console.log("y values : " + yval);

  //for(i = 0 ; i <)

  var svglabel = document.createElementNS(svgns, "svg");
  svglabel.setAttributeNS(null,"height","340");
  svglabel.setAttributeNS(null,"width","40");

  var text = document.createElementNS(svgns, "text");
  text.setAttribute("class","yaxislabels");
  text.setAttribute('x', 30);
  text.setAttribute('y', 150);
  text.setAttribute('fill', '#0000ff');
  text.setAttribute("text-anchor"," middle");
  text.textContent = charts.label;
  text.setAttribute("transform","rotate(270 30,150)");
  svglabel.appendChild(text);

  var svg = document.createElementNS(svgns, "svg");
  svg.setAttributeNS(null,"height","340");
  svg.setAttributeNS(null,"width","554");

  var xline = document.createElementNS(svgns, "line");
  xline.setAttribute("class","xaxis");
  xline.setAttribute("x1", 50);
  xline.setAttribute("y1", jy);
  xline.setAttribute("x2", 550);
  xline.setAttribute("y2", jy);
  xline.setAttribute("stroke", "#4d4d33");

  if(index == no_charts - 1)
  {
  var text = document.createElementNS(svgns, "text");
  text.setAttribute("class","xaxislabels");
  text.setAttribute('x', 300);
  text.setAttribute('y', 340);
  text.setAttribute('fill', '#0000ff');
  text.setAttribute("text-anchor"," middle");
  text.textContent = chartx.label;
  svg.appendChild(text);
  }

  var yline = document.createElementNS(svgns, "line");
  yline.setAttribute("class","yaxis");
  yline.setAttribute("x1", 50);
  yline.setAttribute("y1", jy);
  yline.setAttribute("x2", 50);
  yline.setAttribute("y2", jy-285);
  yline.setAttribute("stroke", "#003d99");

  pxrange = firstypix - exteremeypix;
  valrange = charts.cmax - charts.cmin;
  scale = pxrange / valrange;
  console.log("y repeat : " + Math.ceil((charts.cmax - charts.cmin) / charts.cdiv));

  
  for(iy = 0 ; iy <= Math.floor((charts.cmax - charts.cmin) / charts.cdiv) ; iy++)
  {
          var min = parseFloat(charts.cmin);
          var add = charts.cdiv;
          
          var ytick = document.createElementNS(svgns, "line");
          ytick.setAttribute("class","yticks");
          ytick.setAttribute("x1", 50);
          ytick.setAttribute("y1", jy-jumpy*iy);
          ytick.setAttribute("x2", 45);
          ytick.setAttribute("y2", jy-jumpy*iy);
          ytick.setAttribute("stroke", "green");
          svg.appendChild(ytick);

          var divline = document.createElementNS(svgns, "line");
          divline.setAttribute("class","divlines");
          divline.setAttribute("x1", 50);
          divline.setAttribute("y1", jy-jumpy*iy);
          divline.setAttribute("x2", 550);
          divline.setAttribute("y2", jy-jumpy*iy);
          divline.setAttribute("stroke", "#e6ccb3");
          svg.appendChild(divline);

          var text = document.createElementNS(svgns, "text");
          text.setAttribute("class","ylabels");
          text.setAttribute('x', 40);
          text.setAttribute('y', jy-jumpy*iy);
          text.setAttribute('fill', '#000');
          text.setAttribute("text-anchor", "end");
          text.textContent = min + (add * iy);
          svg.appendChild(text);

          if(firstypix == 0)
            firstypix = jy - jumpy * iy;

          exteremeypix = jy - jumpy * iy;
          //jy -= jumpy;


  }

  jy = firstypix;

  pxrange = firstypix - exteremeypix;
  valrange = charts.cmax - charts.cmin;
  scale = pxrange / valrange;

  var prevx = 0;
  var prevy = 0;

  console.log("first pix : " + firstypix);
  console.log("extereme pix : " + exteremeypix);

  console.log("pix range : " + pxrange);
  console.log("val range : " + valrange + "    " +  "scale : " + scale);
  //X-Axis ticks
  for(ix = 0 ; ix < chartx.no_ticks ; ix++)
  {
          
          console.log("y for plot : " + parseInt(jy - (yval[ix] - charts.cmin) * scale));
          var xtick = document.createElementNS(svgns, "line");
          xtick.setAttribute("class","xticks");
          xtick.setAttribute("x1", jx+jump*ix);
          xtick.setAttribute("y1", jy);
          xtick.setAttribute("x2", jx+jump*ix);
          xtick.setAttribute("y2", jy+5);
          xtick.setAttribute("stroke", "#140d06");
          svg.appendChild(xtick);

          var point = document.createElementNS(svgns, "circle");
          point.setAttribute("class","plotpoints");
          point.setAttribute("cx", jx+jump*ix);
          point.setAttribute("cy", parseInt(jy - (yval[ix] - charts.cmin) * scale));
          point.setAttribute("r", 5);
          point.setAttribute("fill", "#990000");
          point.setAttribute("stroke", "green");
          var title = document.createElementNS(svgns, "title");
          title.innerHTML = yval[ix] + " " + charts.label + " for " + chartx.label + " " + chartx.value[ix];
          point.appendChild(title);
          svg.appendChild(point);

          if(prevx != 0 && prevy != 0)
          {
            var connect = document.createElementNS(svgns, "line");
            connect.setAttribute("class","connects");
            connect.setAttribute("x1", prevx);
            connect.setAttribute("y1", prevy);
            connect.setAttribute("x2", jx+jump*ix);
            connect.setAttribute("y2", parseInt(jy - (yval[ix] - charts.cmin) * scale));
            connect.setAttribute("stroke", "green");
            svg.appendChild(connect);
          }

          if(index == no_charts - 1)
          {
            var text = document.createElementNS(svgns, "text");
            text.setAttribute("class","xlabels");
          text.setAttribute('x', jx+jump*ix);
          text.setAttribute('y', jy+20);
          text.setAttribute('fill', '#000');
          text.setAttribute("text-anchor"," middle");
          text.textContent = chartx.value[ix];
          svg.appendChild(text);
          }

          

          prevx = jx+jump*ix;
          prevy = parseInt(jy - (yval[ix] - charts.cmin) * scale);

          //jx += jump;
  }

  svg.appendChild(xline);
  svg.appendChild(yline);

  
  //svg.appendChild(xtick);

  var myDiv = document.createElement("div");
  //myDiv.appendChild("hi");
  //myDiv.setAttribute("id","div1");
  myDiv.appendChild(svglabel);
  myDiv.appendChild(svg);
  myDiv.setAttribute("align","center");
  //document.getElementById("div1").appendChild(svg);
  document.getElementById("chart-container").appendChild(myDiv);

  console.log("....................................");
}

function cal(charty)
{
  var r = charty.range;
  var low;
  var res;
  console.log("r : " + r + "range : " + charty.range);
  if(Math.log(r) / Math.log(10) < 1)
  {
    if(r == 0.0)
    {
      charty.cmin = Math.floor(charty.min);
    charty.cmax = Math.ceil(charty.max) + 1;
    charty.cdiv = 1;
    console.log("inside zero checking snippet");
    }
    if(r >= 5)
    {
    charty.cmin = Math.floor(charty.min / 10.0) * 10;
    charty.cmax = Math.ceil(charty.max / 10.0) * 10;
    charty.cdiv = (charty.cmax - charty.cmin) * 20 / 100;
    console.log(">=5");
    }
    if(r < 5)
    {
    charty.cmin = (Math.floor(charty.min / 1.0) * 1);
    charty.cmax = Math.ceil(charty.max / 1.0) * 1;
    charty.cdiv = (charty.cmax - charty.cmin) * 20 / 100;
    console.log("cmin : " + charty.cmin);
    console.log("cmax : " + charty.cmax);
    console.log("cmax - cmin : " + (charty.cmax - charty.cmin));
    console.log("cdiv : " + charty.cdiv);
    }
  }
  else if(Math.log(r) / Math.log(10) < 2)
  {
    charty.cmin = Math.floor(charty.min / 10.0) * 10;
    charty.cmax = Math.ceil(charty.max / 10.0) * 10;
    charty.cdiv = (charty.cmax - charty.cmin) * 20 / 100;
  }
  else if(Math.log(r) / Math.log(10) < 3)
  {
    charty.cmin = Math.floor(charty.min / 100.0) * 100;
    charty.cmax = Math.ceil(charty.max / 100.0) * 100;
    charty.cdiv = (charty.cmax - charty.cmin) * 20 / 100;
  }
  else if(Math.log(r) / Math.log(10) < 4)
  {
    charty.cmin = Math.floor(charty.min / 1000.0) * 1000;
    charty.cmax = Math.ceil(charty.max / 1000.0) * 1000;
    charty.cdiv = (charty.cmax - charty.cmin) * 20 / 100;
  }
  else if(Math.log(r) / Math.log(10) < 5)
  {
    charty.cmin = Math.floor(charty.min / 10000.0) * 10000;
    charty.cmax = Math.ceil(charty.max / 10000.0) * 10000;
    charty.cdiv = (charty.cmax - charty.cmin) * 20 / 100;
  }
  else if(Math.log(r) / Math.log(10) < 6)
  {
    charty.cmin = Math.floor(charty.min / 100000.0) * 100000;
    charty.cmax = Math.ceil(charty.max / 100000.0) * 100000;
    charty.cdiv = (charty.cmax - charty.cmin) * 20 / 100;
  }
  //charty.range = res;

  console.log("range charts : " + charty.range);
  console.log("Calculated min max div : " + charty.cmin + "    " + charty.cmax + "    " + charty.cdiv);
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

          document.getElementById("cap").innerHTML = chartnames.caption;
          document.getElementById("cap").setAttribute("align","center");
          document.getElementById("subcap").innerHTML = chartnames.subCaption;
          document.getElementById("subcap").setAttribute("align","center");
          //call functions
          for(i = 0 ; i < no_charts ; i++)
          {
                  cal(charts[i]);
                  drawChart(chartx,charts[i],i,no_charts);
          }

          //document.getElementById("cap").addEventListener("mousemove",myMove);
          //document.getElementById("cap").addEventListener("mouseleave",myLeave);
        }
    }
}

xmlhttp.open('GET','structure.json',true);
xmlhttp.send();