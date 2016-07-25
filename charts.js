var xmlhttp = new XMLHttpRequest(),json;
loadChartData();

var plotpoints = new Array();

var chartDimension=function(t,h,w)
{
  this.type=t;
  this.height=h;
  this.width=w;
}

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

var plotdetails = function(xplot,yplot,data,svg)
{
  this.xplot=xplot;
  this.yplot=yplot;
  this.data=data;
  this.svg=svg;
}

//Listener Functions

function syncEnterFunction(e)
{
  console.log("Calling sync enter custom event");

  var svgns = "http://www.w3.org/2000/svg";

  // var ch = document.getElementById("crosshair");
  var ch = document.createElementNS(svgns, "line");
  ch.setAttribute("class","synccrosshair");
  ch.setAttribute("id","synccrosshair");
  ch.setAttribute("x1", e.detail.x);
  ch.setAttribute("y1", (height-bpad));
  ch.setAttribute("x2", e.detail.x);
  ch.setAttribute("y2", tpad);
  ch.setAttribute("stroke", "#4d4d33");
  

  e.currentTarget.appendChild(ch);
  //console.log("ch : ", e.currentTarget);
  //debugger;   
}

function myEnter(event)
{
  var svgns = "http://www.w3.org/2000/svg";

  var syncEventEnter = new CustomEvent('syncEnter',
  {
      'detail': {
        x : event.clientX,
        y : event.clientY
      }
  });
  
  console.log("inside enter event.");

  var ch = document.createElementNS(svgns, "line");
  ch.setAttribute("class","crosshair1");
  ch.setAttribute("id","crosshair1");
  ch.setAttribute("x1", event.clientX);
  ch.setAttribute("y1", (height-bpad));
  ch.setAttribute("x2", event.clientX);
  ch.setAttribute("y2", tpad);
  ch.setAttribute("stroke", "#4d4d33");

  //console.log("this is : ", event.currentTarget);
  event.currentTarget.appendChild(ch);

  var svglist = document.getElementsByClassName("chartsvg");
  //console.log(svglist);

  var svg;
  for(svg of svglist)
  {
    //console.log(svg);
    if(event.currentTarget != svg)
      svg.dispatchEvent(syncEventEnter);
  }
  //document.body.dispatchEvent(syncEvent);
}

function syncMoveFunction(e)
{
  console.log("syn move function");
  var i;

  //var ch = document.getElementsByClassName("synccrosshair");
  var c = document.getElementsByClassName("synccrosshair");

  //console.log("move event crosshair : ", c);
  // var ch = document.createElementNS(svgns, "line");
  for(ch of c)
  {
    if(e.detail.x > lpad && e.detail.y < (height - bpad))
    {
      console.log("sync move inside if");
      ch.setAttribute("x1", e.detail.x);
      ch.setAttribute("y1", (height-bpad));
      ch.setAttribute("x2", e.detail.x);
      ch.setAttribute("y2", tpad);
      ch.setAttribute("stroke", "#4d4d33");
      //e.currentTarget.appendChild(c);

      for(i = 0 ; i < plotpoints.length ; i++)
      {
        //if(plotpoints[i].svg === e.currentTarget)
        //{
          
          for(cn of plotpoints[i].xplot)
            if(((e.detail.x) <= (cn + 2)) && ((e.detail.x) >= (cn - 2)))
            {
              var svgns = "http://www.w3.org/2000/svg";
              var text = document.createElementNS(svgns, "text");
              text.setAttribute("id","tooltip");
              text.setAttribute("class","tooltip");
              text.setAttribute('x', e.detail.x);
              text.setAttribute('y', plotpoints[i].yplot[plotpoints[i].xplot.indexOf(cn)]);
              text.setAttribute('fill', '#ff9f80');
              text.setAttribute("text-anchor","end");
              //console.log("tool tip : ");
              text.textContent = plotpoints[i].data[plotpoints[i].xplot.indexOf(cn)];
              plotpoints[i].svg.appendChild(text);
            }
            else
              if(plotpoints[i].svg.getElementById("tooltip") != null)
              {
                var t = plotpoints[i].svg.getElementById("tooltip");
                t.textContent = "";
                plotpoints[i].svg.appendChild(t);
              }
      }
    }
  }
}

function myMove(event)
{
  // console.log(this);
  // console.log(event);
  var svgns = "http://www.w3.org/2000/svg";
  var ch = document.getElementById("crosshair1");

  if(event.clientX > lpad && event.clientY < (height - bpad))
  {
    ch.setAttribute("x1", event.clientX);
    ch.setAttribute("y1", (height-bpad));
    ch.setAttribute("x2", event.clientX);
    ch.setAttribute("y2", tpad);
    ch.setAttribute("stroke", "#4d4d33");
  }

  var syncMoveEvent = new CustomEvent('syncMove',
  {
      'detail': {
        x : event.clientX,
        y : event.clientY
      }
  });

  var svglist = document.getElementsByClassName("chartsvg");
  //console.log(svglist);

  var svg;
  for(svg of svglist)
  {
    //console.log(svg);
    //if(event.currentTarget != svg)
      svg.dispatchEvent(syncMoveEvent);
  }
}

function syncLeaveFunction(e)
{
  console.log("syn leave function");

  var svgns = "http://www.w3.org/2000/svg";

  //var ch = document.getElementsByClassName("synccrosshair");
  var ch = document.getElementById("synccrosshair");

  // var svglist = document.getElementsByClassName("chartsvg");
  //console.log("current target in sync leave : ", e.currentTarget.getElementById("synccrosshair"));

  //console.log("fetched by class ch in sync leave : ", ch);
  // var ch = document.createElementNS(svgns, "line");
  // for(c of ch)
    e.currentTarget.removeChild(e.currentTarget.getElementById("synccrosshair"));
  
}

function myLeave(event)
{
  console.log("Leave Event");
  //alert("hello leave");

  var syncLeaveEvent = new CustomEvent('syncLeave',
  {
      'detail': {
        x : event.clientX,
        y : event.clientY
      }
  });
  //debugger;
  var ch = document.getElementById("crosshair1");

  // var ch = document.createElementNS(svgns, "line");
  event.currentTarget.removeChild(ch);

  var svglist = document.getElementsByClassName("chartsvg");
  //console.log(svglist);

  var svg;
  for(svg of svglist)
  {
    //console.log(svg);
    if(event.currentTarget != svg)
      svg.dispatchEvent(syncLeaveEvent);
  }
}

var height;
var width;
var lpad;
var rpad;
var tpad;
var bpad;
var scale;

//Chart Rendering
function drawChart(chartsize,chartx,charts,index,no_charts)
{
  var colorflag = 0;
  var svgns = "http://www.w3.org/2000/svg";

  var yval = charts.value.yvalues;
  var exteremeypix;
  var firstypix = 0;
  var pxrange;

  height = chartsize.height;
  width = chartsize.width;
  lpad = width/7;
  rpad = 10;
  tpad = height/7;
  bpad = height/6;

  var ix;
  var jump = ((width-rpad) - lpad)/(chartx.no_ticks - 1);
  var jx = 50;

  var iy;
  var jumpy = ((height-bpad) - tpad)/((charts.cmax - charts.cmin) / charts.cdiv);
  var jy = 300;

  var xplot = [];
  var yplot = [];
  var data = [];
  var svglinked;

  //console.log("jump x : " + jump);
  //console.log("jump y : " + jumpy);
  //console.log("y values : " + yval);

  //for(i = 0 ; i <)

  var svglabel = document.createElementNS(svgns, "svg");
  svglabel.setAttributeNS(null,"height","340");
  svglabel.setAttributeNS(null,"width","40");

  var svg = document.createElementNS(svgns, "svg");
  svg.setAttributeNS(null,"class","chartsvg");
  svg.setAttributeNS(null,"height",height);
  svg.setAttributeNS(null,"width",width);

  var rect = document.createElementNS(svgns, "rect");
            rect.setAttribute("class","seriesrect");
            rect.setAttribute("x",lpad);
            rect.setAttribute("y",(height-bpad+(bpad*0.2)));
            rect.setAttribute("height",bpad*0.6);
            rect.setAttribute("width",(width-rpad) - lpad);
            rect.setAttribute("stroke", "#b3daff");
            rect.setAttribute("stroke-width", "1");
            //rect.setAttribute("border-color","#737373");
            //rect.setAttribute("border-style", "ridge");
            rect.setAttribute("fill","#e6f3ff");
            svg.appendChild(rect);

  var text = document.createElementNS(svgns, "text");
  text.setAttribute("class","yaxislabels");
  text.setAttribute('x', width*0.55);
  text.setAttribute('y', height-bpad+(bpad*0.55));
  text.setAttribute('fill', '#0000ff');
  text.setAttribute("text-anchor"," middle");
  text.textContent = charts.label;
  //text.setAttribute("transform","rotate(270 " + (lpad*0.4) + "," +(height*0.5) + ")");
  svg.appendChild(text);

  /*var text = document.createElementNS(svgns, "text");
  text.setAttribute("class","yaxislabels");
  text.setAttribute('x', lpad*0.4);
  text.setAttribute('y', height*0.5);
  text.setAttribute('fill', '#0000ff');
  text.setAttribute("text-anchor"," middle");
  text.textContent = charts.label;
  text.setAttribute("transform","rotate(270 " + (lpad*0.4) + "," +(height*0.5) + ")");
  svg.appendChild(text);*/

  var xline = document.createElementNS(svgns, "line");
  xline.setAttribute("class","xaxis");
  xline.setAttribute("x1", lpad);
  xline.setAttribute("y1", height-bpad);
  xline.setAttribute("x2", width-rpad);
  xline.setAttribute("y2", height-bpad);
  xline.setAttribute("stroke", "#4d4d33");

  if(index == no_charts - 1)
  {
    var xname = document.createElementNS(svgns, "text");
    xname.setAttribute("class","xaxislabels");
    xname.setAttribute('x', 300);
    xname.setAttribute('y', 200);
    xname.setAttribute('fill', '#0000ff');
    xname.setAttribute("text-anchor"," middle");
    xname.textContent = chartx.label;
    svg.appendChild(xname);
  }

  var yline = document.createElementNS(svgns, "line");
  yline.setAttribute("class","yaxis");
  yline.setAttribute("x1", lpad);
  yline.setAttribute("y1", height-bpad);
  yline.setAttribute("x2", lpad);
  yline.setAttribute("y2", tpad);
  yline.setAttribute("stroke", "#003d99");

  pxrange = firstypix - exteremeypix;
  valrange = charts.cmax - charts.cmin;
  scale = pxrange / valrange;
  //console.log("y repeat : " + Math.ceil((charts.cmax - charts.cmin) / charts.cdiv));

  //Y-axis ticks and label rendered
  for(iy = 0 ; iy <= Math.floor((charts.cmax - charts.cmin) / charts.cdiv) ; iy++)
  {
          var min = parseFloat(charts.cmin);
          var add = charts.cdiv;
          
          var ytick = document.createElementNS(svgns, "line");
          ytick.setAttribute("class","yticks");
          ytick.setAttribute("x1", lpad);
          ytick.setAttribute("y1", (height-bpad)-jumpy*iy);
          ytick.setAttribute("x2", lpad-8);
          ytick.setAttribute("y2", (height-bpad)-jumpy*iy);
          ytick.setAttribute("stroke", "green");
          svg.appendChild(ytick);

          var divline = document.createElementNS(svgns, "line");
          divline.setAttribute("class","divlines");
          divline.setAttribute("x1", lpad);
          divline.setAttribute("y1", (height-bpad)-jumpy*iy);
          divline.setAttribute("x2", width-rpad);
          divline.setAttribute("y2", (height-bpad)-jumpy*iy);
          divline.setAttribute("stroke", "#ff4000");
          svg.appendChild(divline);

          if(iy < Math.floor((charts.cmax - charts.cmin) / charts.cdiv))
          {
            var rect = document.createElementNS(svgns, "rect");
            rect.setAttribute("class","divrect");
            rect.setAttribute("x",lpad);
            rect.setAttribute("y",(height-bpad)-jumpy*(iy+1));
            rect.setAttribute("height",jumpy-1);
            rect.setAttribute("width",(width-rpad) - lpad + 4);
            rect.setAttribute("stroke", "#737373");
            rect.setAttribute("stroke-width", "0.5");
            //rect.setAttribute("border-color","#737373");
            //rect.setAttribute("border-style", "ridge");
            if(colorflag == 0)
            {
              rect.setAttribute("fill","#e6e6e6");
              colorflag = 1;
            }
            else
            {
              rect.setAttribute("fill","#ffffff");
              colorflag = 0;                                
            }
            svg.appendChild(rect);
          }

          var text = document.createElementNS(svgns, "text");
          text.setAttribute("class","ylabels");
          text.setAttribute('x', lpad-10);
          text.setAttribute('y', (height-bpad)-jumpy*iy);
          text.setAttribute('fill', '#000');
          text.setAttribute("text-anchor", "end");
          text.textContent = min + (add * iy);
          svg.appendChild(text);

          if(firstypix == 0)
            firstypix = (height - bpad) - jumpy * iy;

          exteremeypix = (height - bpad) - jumpy * iy;
          //jy -= jumpy;
  }

  jy = firstypix;

  pxrange = firstypix - exteremeypix;
  valrange = charts.cmax - charts.cmin;
  scale = pxrange / valrange;

  var prevx = 0;
  var prevy = 0;

  //console.log("first pix : " + firstypix);
  //console.log("extereme pix : " + exteremeypix);

  //console.log("pix range : " + pxrange);
  //console.log("val range : " + valrange + "    " +  "scale : " + scale);
  
  //X-Axis ticks and data plotting
  for(ix = 0 ; ix < chartx.no_ticks ; ix++)
  {      
          //console.log("y for plot : " + parseInt(jy - (yval[ix] - charts.cmin) * scale));
          var xtick = document.createElementNS(svgns, "line");
          xtick.setAttribute("class","xticks");
          xtick.setAttribute("x1", lpad+jump*ix);
          xtick.setAttribute("y1", jy);
          xtick.setAttribute("x2", lpad+jump*ix);
          xtick.setAttribute("y2", jy+7);
          xtick.setAttribute("stroke", "#140d06");
          svg.appendChild(xtick);

          if(index == no_charts - 1)
          {
            var text = document.createElementNS(svgns, "text");
            text.setAttribute("class","xlabels");
            text.setAttribute('x', lpad+jump*ix);
            text.setAttribute('y', (height-bpad)+20);
            text.setAttribute('fill', '#000');
            text.setAttribute("text-anchor"," middle");
            text.textContent = chartx.value[ix];
            //text.setAttribute("transform","rotate(270 19,150)");
            svg.appendChild(text);
          }
          
          if(yval[ix] != 22446688)
          {
            if(prevx != 0 && prevy != 0)
            {
              var connect = document.createElementNS(svgns, "line");
              connect.setAttribute("class","connects");
              connect.setAttribute("x1", prevx);
              connect.setAttribute("y1", prevy);
              connect.setAttribute("x2", lpad+jump*ix);
              connect.setAttribute("y2", parseInt((height-bpad) - (yval[ix] - charts.cmin) * scale));
              connect.setAttribute("stroke", "green");
              svg.appendChild(connect);
            }

            var point = document.createElementNS(svgns, "circle");
            point.setAttribute("class","plotpoints");
            point.setAttribute("id", ix);
            point.setAttribute("cx", lpad+jump*ix);
            point.setAttribute("cy", parseInt((height-bpad) - (yval[ix] - charts.cmin) * scale));
            point.setAttribute("r", 5);
            point.setAttribute("fill", "#990000");
            point.setAttribute("stroke", "green");
            var title = document.createElementNS(svgns, "title");
            title.setAttribute("class","tip");
            title.innerHTML = yval[ix] + " " + charts.label;
            point.appendChild(title);
            svg.appendChild(point);

            prevx = lpad+jump*ix;
            prevy = parseInt((height-bpad) - (yval[ix] - charts.cmin) * scale);

            xplot[ix] = lpad + jump * ix;
            yplot[ix] = parseInt((height-bpad) - (yval[ix] - charts.cmin) * scale);
            data[ix] = title.innerHTML;
          }
          else
            continue;

          svglinked = svg;
          //jx += jump;
  }

  plotpoints[index] = new plotdetails(xplot,yplot,data,svglinked);
  console.log("New object created : ", plotpoints[index]);

  svg.appendChild(xline);
  svg.appendChild(yline);

  //Custom Event Listener function
  

  //Listeners
  //document.body.addEventListener("sync", syncFunction, false);
  svg.addEventListener("syncEnter",syncEnterFunction,false);
  svg.addEventListener("syncMove",syncMoveFunction,false);
  svg.addEventListener("syncLeave",syncLeaveFunction,false);

  svg.addEventListener("mouseleave",myLeave);
  svg.addEventListener("mousemove",myMove);
  svg.addEventListener("mouseenter",myEnter);

  //Div Created
  var myDiv = document.createElement("div");
  
  //Div appended with svg
  //myDiv.appendChild(svglabel);
  //myDiv.appendChild(svg);
  //myDiv.setAttribute("align","center");
  
  document.getElementById("chart-container").appendChild(svg);

  console.log("....................................");
}

function plotxAxisBelow(svg,lpad,colpad,jump,ix,height,bpad,chartx)
{
  var svgns = "http://www.w3.org/2000/svg";

  var text = document.createElementNS(svgns, "text");
            text.setAttribute("class","xlabels");
            text.setAttribute('x', lpad+colpad+jump*ix);
            text.setAttribute('y', (height-bpad)+20);
            text.setAttribute('fill', '#000');
            text.setAttribute("text-anchor"," middle");
            text.textContent = chartx.value[ix];
            //text.setAttribute("transform","rotate(270 19,150)");
            svg.appendChild(text);
}

function plotxAxisAbove(svg,lpad,colpad,jump,ix,height,tpad,chartx)
{
  var svgns = "http://www.w3.org/2000/svg";

  var text = document.createElementNS(svgns, "text");
            text.setAttribute("class","xlabels");
            text.setAttribute('x', lpad+colpad+jump*ix);
            text.setAttribute('y', (tpad)-20);
            text.setAttribute('fill', '#000');
            text.setAttribute("text-anchor"," middle");
            text.textContent = chartx.value[ix];
            //text.setAttribute("transform","rotate(270 19,150)");
            svg.appendChild(text);
}

var yval;

function drawColChart(chartsize,chartx,charts,index,no_charts)
{
  var colorflag = 0;
  var svgns = "http://www.w3.org/2000/svg";

  yval = charts.value.yvalues;
  var exteremeypix;
  var firstypix = 0;
  var pxrange;

  height = chartsize.height;
  width = chartsize.width;
  lpad = width/7;
  rpad = 10;
  tpad = height/7;
  bpad = height/6;

  var ix;
  var jump = ((width-rpad) - lpad)/(chartx.no_ticks);
  //var collpad = lpad * 0.4;
  var colpad = jump * 0.5;
  var jx = 50;

  var iy;
  var jumpy = ((height-bpad) - tpad)/((charts.cmax - charts.cmin) / charts.cdiv);
  var jy = 300;

  var xplot = [];
  var yplot = [];
  var data = [];
  var svglinked;

  //console.log("jump x : " + jump);
  //console.log("jump y : " + jumpy);
  //console.log("y values : " + yval);

  //for(i = 0 ; i <)

  var svg = document.createElementNS(svgns, "svg");
  svg.setAttributeNS(null,"class","chartsvg");
  svg.setAttributeNS(null,"height",height);
  svg.setAttributeNS(null,"width",width);

  var rect = document.createElementNS(svgns, "rect");
            rect.setAttribute("class","seriesrect");
            rect.setAttribute("x",lpad);
            rect.setAttribute("y",(height-bpad+(bpad*0.2)));
            rect.setAttribute("height",bpad*0.6);
            rect.setAttribute("width",(width-rpad) - lpad);
            rect.setAttribute("stroke", "#b3daff");
            rect.setAttribute("stroke-width", "1");
            //rect.setAttribute("border-color","#737373");
            //rect.setAttribute("border-style", "ridge");
            rect.setAttribute("fill","#e6f3ff");
            svg.appendChild(rect);

  var text = document.createElementNS(svgns, "text");
  text.setAttribute("class","yaxislabels");
  text.setAttribute('x', width*0.55);
  text.setAttribute('y', height-bpad+(bpad*0.55));
  text.setAttribute('fill', '#0000ff');
  text.setAttribute("text-anchor"," middle");
  text.textContent = charts.label;
  //text.setAttribute("transform","rotate(270 " + (lpad*0.4) + "," +(height*0.5) + ")");
  svg.appendChild(text);

  var xline = document.createElementNS(svgns, "line");
  xline.setAttribute("class","xaxis");
  xline.setAttribute("x1", lpad);
  xline.setAttribute("y1", height-bpad);
  xline.setAttribute("x2", width-rpad);
  xline.setAttribute("y2", height-bpad);
  xline.setAttribute("stroke", "#4d4d33");

  if(index == no_charts - 1)
  {
    var xname = document.createElementNS(svgns, "text");
    xname.setAttribute("class","xaxislabels");
    xname.setAttribute('x', 300);
    xname.setAttribute('y', 200);
    xname.setAttribute('fill', '#0000ff');
    xname.setAttribute("text-anchor"," middle");
    xname.textContent = chartx.label;
    svg.appendChild(xname);
  }

  var yline = document.createElementNS(svgns, "line");
  yline.setAttribute("class","yaxis");
  yline.setAttribute("x1", lpad);
  yline.setAttribute("y1", height-bpad);
  yline.setAttribute("x2", lpad);
  yline.setAttribute("y2", tpad);
  yline.setAttribute("stroke", "#003d99");

  pxrange = firstypix - exteremeypix;
  valrange = charts.cmax - charts.cmin;
  scale = pxrange / valrange;
  //console.log("y repeat : " + Math.ceil((charts.cmax - charts.cmin) / charts.cdiv));

  //Y-axis ticks and label rendered
  for(iy = 0 ; iy <= Math.floor((charts.cmax - charts.cmin) / charts.cdiv) ; iy++)
  {
          var min = parseFloat(charts.cmin);
          var add = charts.cdiv;
          
          var ytick = document.createElementNS(svgns, "line");
          ytick.setAttribute("class","yticks");
          ytick.setAttribute("x1", lpad);
          ytick.setAttribute("y1", (height-bpad)-jumpy*iy);
          ytick.setAttribute("x2", lpad-8);
          ytick.setAttribute("y2", (height-bpad)-jumpy*iy);
          ytick.setAttribute("stroke", "green");
          svg.appendChild(ytick);

          var divline = document.createElementNS(svgns, "line");
          divline.setAttribute("class","divlines");
          divline.setAttribute("x1", lpad);
          divline.setAttribute("y1", (height-bpad)-jumpy*iy);
          divline.setAttribute("x2", width-rpad);
          divline.setAttribute("y2", (height-bpad)-jumpy*iy);
          divline.setAttribute("stroke", "#eee6ff");
          svg.appendChild(divline);

          if(iy < Math.floor((charts.cmax - charts.cmin) / charts.cdiv))
          {
            var rect = document.createElementNS(svgns, "rect");
            rect.setAttribute("class","divrect");
            rect.setAttribute("x",lpad);
            rect.setAttribute("y",(height-bpad)-jumpy*(iy+1));
            rect.setAttribute("height",jumpy);
            rect.setAttribute("width",(width-rpad) - lpad);
            rect.setAttribute("stroke", "#eee6ff");
            rect.setAttribute("stroke-width", "1");
            //rect.setAttribute("border-color","#737373");
            //rect.setAttribute("border-style", "ridge");
            if(colorflag == 0)
            {
              rect.setAttribute("fill","#ffffff");
              colorflag = 1;
            }
            else
            {
              rect.setAttribute("fill","#eee6ff");
              colorflag = 0;                                
            }
            svg.appendChild(rect);
          }

          var text = document.createElementNS(svgns, "text");
          text.setAttribute("class","ylabels");
          text.setAttribute('x', lpad-10);
          text.setAttribute('y', (height-bpad)-jumpy*iy);
          text.setAttribute('fill', '#000');
          text.setAttribute("text-anchor", "end");
          text.textContent = min + (add * iy);
          svg.appendChild(text);

          if(firstypix == 0)
            firstypix = (height - bpad) - jumpy * iy;

          exteremeypix = (height - bpad) - jumpy * iy;
          //jy -= jumpy;
  }

  jy = firstypix;

  pxrange = firstypix - exteremeypix;
  valrange = charts.cmax - charts.cmin;
  scale = pxrange / valrange;

  var prevx = 0;
  var prevy = 0;

  //console.log("first pix : " + firstypix);
  //console.log("extereme pix : " + exteremeypix);

  //console.log("pix range : " + pxrange);
  //console.log("val range : " + valrange + "    " +  "scale : " + scale);
  
  //X-Axis ticks and data plotting
  for(ix = 0 ; ix < chartx.no_ticks ; ix++)
  {      
          //console.log("y for plot : " + parseInt(jy - (yval[ix] - charts.cmin) * scale));
          var xtick = document.createElementNS(svgns, "line");
          xtick.setAttribute("class","xticks");
          xtick.setAttribute("x1", lpad+colpad+jump*ix);
          xtick.setAttribute("y1", jy);
          xtick.setAttribute("x2", lpad+colpad+jump*ix);
          xtick.setAttribute("y2", jy+7);
          xtick.setAttribute("stroke", "#140d06");
          svg.appendChild(xtick);
          collpad = 0;

          /*if(index == no_charts - 1)
          {
            plotxAxisBelow(svg,lpad,colpad,jump,ix,height,bpad,chartx);
            // var text = document.createElementNS(svgns, "text");
            // text.setAttribute("class","xlabels");
            // text.setAttribute('x', lpad+colpad+jump*ix);
            // text.setAttribute('y', (height-bpad)+20);
            // text.setAttribute('fill', '#000');
            // text.setAttribute("text-anchor"," middle");
            // text.textContent = chartx.value[ix];
            // //text.setAttribute("transform","rotate(270 19,150)");
            // svg.appendChild(text);
          }*/
          plotxAxisAbove(svg,lpad,colpad,jump,ix,height,tpad,chartx);
          
          if(yval[ix] != 22446688)
          {
            var rect = document.createElementNS(svgns, "rect");
            rect.setAttribute('class','column');
         rect.setAttribute('x', lpad+(colpad/2)+jump*ix);
         rect.setAttribute('y', parseInt((height-bpad) - (yval[ix] - charts.cmin) * scale));
         rect.setAttribute('height', ((height-bpad) - parseInt((height-bpad) - (yval[ix] - charts.cmin) * scale)));
         rect.setAttribute('width', colpad);
         rect.setAttribute('fill', '#0084ff');
            /*point.setAttribute("class","plotpoints");
            point.setAttribute("id", ix);
            point.setAttribute("cx", lpad+jump*ix);
            point.setAttribute("cy", parseInt((height-bpad) - (yval[ix] - charts.cmin) * scale));
            point.setAttribute("r", 5);
            point.setAttribute("fill", "#990000");
            point.setAttribute("stroke", "green");
            var title = document.createElementNS(svgns, "title");
            title.setAttribute("class","tip");
            title.innerHTML = yval[ix] + " " + charts.label;
            point.appendChild(title);*/
            svg.appendChild(rect);

            //prevx = lpad+jump*ix;
            //prevy = parseInt((height-bpad) - (yval[ix] - charts.cmin) * scale);

            xplot[ix] = lpad + jump * ix;
            yplot[ix] = parseInt((height-bpad) - (yval[ix] - charts.cmin) * scale);
            data[ix] = parseInt(yval[ix]);
          }
          else
            continue;

          svglinked = svg;
          //jx += jump;
  }

  plotpoints[index] = new plotdetails(xplot,yplot,data,svglinked);
  console.log("New object created : ", plotpoints[index]);

  svg.appendChild(xline);
  svg.appendChild(yline);

  //Custom Event Listener function
  

  //Listeners
  //document.body.addEventListener("sync", syncFunction, false);
  //svg.addEventListener("syncEnter",syncEnterFunction,false);
  //svg.addEventListener("syncMove",syncMoveFunction,false);
  //svg.addEventListener("syncLeave",syncLeaveFunction,false);

  //svg.addEventListener("mouseleave",myLeave);


  

  /*var columns = document.getElementsByClassName("column");

    for(var i = 0 ; i < columns.length ; i++)
    {
      var colx = Number(columns[i].getBoundingClientRect().left);
      var coly = Number(columns[i].getBoundingClientRect().top);
      var colheight = Number(columns[i].getBoundingClientRect().height);
      var colwidth = Number(columns[i].getBoundingClientRect().width);

      console.log(columns[i] + " x : " + colx + " y : " + coly + " height : " + colheight + " width : " + colwidth);

      if(e.detail.x > colx && e.detail.x < colx+colwidth && e.detail.y > coly)
      {
        columns[i].setAttribute("fill", "#d65c5c");
      }
      else
      {
        columns[i].setAttribute("fill", "#0084ff");
      }
      svg.appendChild(columns[i]);
    }*/

  //Div Created
  var myDiv = document.createElement("div");
  
  //Div appended with svg
  //myDiv.appendChild(svglabel);
  //myDiv.appendChild(svg);
  //myDiv.setAttribute("align","center");
  
  document.getElementById("chart-container").appendChild(svg);

  console.log("....................................");
}

function addingColumnEvent()
{
  var columns = document.getElementsByClassName("column");
  //console.log("column count : " + document.getElementsByClassName("column").length);
  //var im=0;
  //var jm=0;

  for(var col of document.getElementsByClassName("column"))
  {
    //console.log("outer loop calling : " + im++);
    col.addEventListener("mouseover",function(){

      var syncColumnEvent = new CustomEvent('syncColumnOver',
      {
        'detail': {
          x : event.clientX,
          y : event.clientY
        }
      });
    
      //console.log("inside mouse over event.");
      //console.log(svglist);
      for(c of document.getElementsByClassName("column"))
      {
        //console.log("inner column count : " + document.getElementsByClassName("column").length);
        //console.log("inner loop mouse over calling : " + jm++);
        if(c.getAttribute("x") == event.currentTarget.getAttribute("x"))
          c.dispatchEvent(syncColumnEvent);
      }
    });



    col.addEventListener("mouseleave",function(){

      var syncColumnLeaveEvent = new CustomEvent('syncColumnLeave',
      {
        'detail': {
            //x : -100,
            //y : -100
        }
      });

      console.log("inside mouse leave event");

      for(c of document.getElementsByClassName("column"))
      {
        if(c.getAttribute("x") == event.currentTarget.getAttribute("x"))
          c.dispatchEvent(syncColumnLeaveEvent);
      } 
    });
    


    col.addEventListener("syncColumnOver", function(e){

      e.currentTarget.style.fill = "#d65c5c";

      var svgns = "http://www.w3.org/2000/svg";

console.log("Current target : ", e.currentTarget.getBBox().y);
      var rect = document.createElementNS(svgns, "rect");
            rect.setAttribute('class','toolrect');
            rect.setAttribute("id",'toolrect');
         rect.setAttribute('x', e.currentTarget.getBBox().x + e.currentTarget.getBBox().width/2);
         rect.setAttribute('y', e.currentTarget.getBBox().y);
         rect.setAttribute('height', 20);
         rect.setAttribute('width', 50);
         rect.setAttribute('fill', '#ffccff');
         rect.setAttribute("stroke", 'brown');
         console.log("target : ", e.currentTarget.parentElement);
            e.currentTarget.parentElement.appendChild(rect);

      var tool = document.createElementNS(svgns, "text");
            tool.setAttribute('class','tooltext');
            tool.setAttribute("id",'tooltext');
         tool.setAttribute('x', e.currentTarget.getBBox().x + e.currentTarget.getBBox().width/2);
         tool.setAttribute('y', e.currentTarget.getBBox().y);
         tool.setAttribute('fill', '#ff9f80');
         tool.setAttribute("text-anchor","end");
         //console.log("tool tip : ");

         /*var collist = document.getElementsByClassName("column");

         for(var plot = 0 ; plot < plotpoints.length ; plot++)
          if(plotpoints[plot].svg === e.currentTarget.parentElement)
            for(var col = 0 ; col < collist.length ; col++)
              if(e.currentTarget.getBBox().x == collist[col].getBBox().x)
              {
              tool.textContent = plotpoints[plot].data[col];
              console.log("y text : " + plotpoints[plot].data[col]);
            }
         //plotpoints[i].svg.appendChild(text);
         //console.log("target : ", e.currentTarget.parentElement);*/
            e.currentTarget.parentElement.appendChild(rect);
            e.currentTarget.parentElement.appendChild(tool);



      /*var box = document.createElement("div");
      box.setAttribute("class","boxtip");
      box.setAttribute("id","boxtip");
      box.innerHTML = "Hi";
      box.style.left = e.detail.x;
      box.style.top = e.detail.y;
      box.style.backgroundColor = "#ffcccc";
      //console.log("target : ", e.target.parentElement);
      e.target.parentElement.appendChild(box);*/
    });

    col.addEventListener("syncColumnLeave", function(e){

      e.currentTarget.style.fill = "#0084ff";

      var box = document.getElementById("toolrect");
      e.currentTarget.parentElement.removeChild(box);

      var text = document.getElementById("tooltext");
      e.currentTarget.parentElement.removeChild(text);
    });
  }
}

function cal(charty)
{
  var r = charty.range;
  var low;
  var res;
  //console.log("r : " + r + "range : " + charty.range);
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
      //console.log("cmin : " + charty.cmin);
      //console.log("cmax : " + charty.cmax);
      //console.log("cmax - cmin : " + (charty.cmax - charty.cmin));
      //console.log("cdiv : " + charty.cdiv);
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
  
  //console.log("range charts : " + charty.range);
  //console.log("Calculated min max div : " + charty.cmin + "    " + charty.cmax + "    " + charty.cdiv);
}

function cal_min_max(charty)
{
  
  var pad = Math.ceil((5 * charty.range) / 100);
  charty.cmin = parseFloat(charty.min) - pad;
  charty.cmax = parseFloat(charty.max) + pad;
  charty.cdiv = Math.ceil((20 * (charty.cmax - charty.cmin)) / 100);
  //console.log("Calculated min max : " + charty.cmin + "    " + charty.cmax + "    " + charty.cdiv + "    " + pad);
  //console.log("And then : " + typeof(charty.range));
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


          //Chart caption and sub caption
          var chartnames = new chartDetails(json.chartCaption,json.chartSubCaption);
          var chartsize = new chartDimension(json.type,json.chartHeight,json.chartWidth);          

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
                      if(temp1.yvalues[j] == null || temp1.yvalues[j] == "" || temp1.yvalues[j] == undefined)
                      {
                        temp1.yvalues[j] = 22446688;
                      }
                      else
                      {
                      if(temp1.yvalues[j] < min)
                        min = temp1.yvalues[j];
                      if(temp1.yvalues[j] > max)
                        max = temp1.yvalues[j];
                      }
                    }

                    charts[i] = new chartyAxis(ylabel, temp1, min, max);
          }
          console.log("Parsed Internal Data from Fetched Data");
          console.log(chartsize);
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
                  if(chartsize.type == "line")
                    drawChart(chartsize,chartx,charts[i],i,no_charts);
                  if(chartsize.type == "col")
                    drawColChart(chartsize,chartx,charts[i],i,no_charts);
          }
          addingColumnEvent();
          placexAxis();

          //document.getElementById("cap").addEventListener("mousemove",myMove);
          //document.getElementById("cap").addEventListener("mouseleave",myLeave);
        }
    }
}

function placexAxis()
{
  var svglist = document.getElementsByClassName("chartsvg");
  var coox = [];
  var i=0;

  for(var svg of svglist)
    coox[i++] = svg.getB;

  console.log(coox);
}

xmlhttp.open('GET','structure.json',true);
xmlhttp.send();