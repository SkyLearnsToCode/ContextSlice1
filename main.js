//prepare svg
var svgRect = document.getElementById("example").childNodes[3];
var canvasWidth = $(svgRect).width();
var canvasHeight = $(svgRect).height();

var svgEg = document.getElementById("example").childNodes[3].childNodes[1];
var svgNew = document.getElementById("newgraph").childNodes[3].childNodes[1];

//$(svgEg).width(canvasWidth);
//$(svgEg).height(canvasHeight);
$(svgNew).width(canvasWidth);
$(svgNew).height(canvasHeight);

//graph property
var r = 5
var linewidth = 1

//get all the nodes for workers to select
var optionlist = document.getElementsByClassName("nodelist");
var doc1 = document.getElementById("doc1");
var nodes = doc1.getElementsByTagName("em");
var xs = [];
var ys = [];

for(i = 0; i < nodes.length; i++){
  var color = "black";
  
  switch(nodes[i].className){
    case "person":
      color = "orange";
      break;
    case "location":
      color = "#33CC33";
      break;
    case "organization":
      color = "#FF6699";
      break;
    case "money":
      color = "yellow";
      break;
    case "miscellanea":
      color = "#CC66FF";
      break;
    case "phone":
      color = "#FF66CC";
      break;
    case "interesting":
      color = "#00FFFF";
      break;
    case "date":
      color = "#33CCFF";
  }

  x = canvasWidth/2-30+Math.sin(360/(nodes.length-3)*i)*(canvasWidth-100)/2;
  xs.push(x);
  y = canvasHeight/2+Math.cos(360/(nodes.length-3)*i)*(canvasHeight-100)/2;
  ys.push(y);
  svgNew.innerHTML += "<circle id=" + i + " cx=" + x + " cy=" + y + " r=" + r + " stroke=\"black\" stroke-width="+ linewidth + " fill="+color+" />";
  svgNew.innerHTML += "<text x=" + x + " y=" + y + " fill=\"black\">"+nodes[i].innerHTML+"</text>"
  optionlist[0].innerHTML += "<option value="+i+">"+nodes[i].innerHTML+"</option>"
}

//svgEg.innerHTML = svgNew.innerHTML;

optionlist[1].innerHTML = optionlist[0].innerHTML;
//svgEg.innerHTML += "";
//var demo = document.getElementById("demo");
function connectDetail(){
  alert("yes!");
}

$( "button" ).click(function( event ) {
  i1 = $("#node1").val();
  i2 = $("#node2").val();
  edgeNote = $("#edgeNote").val();
  if (edgeNote == "other"){
    edgeNote = $("#newNote").val();
  }
  edgeNote += "("+$("#docid").val()+")";
  svgNew.innerHTML += "<path d=\"M"+xs[i1]+" "+ys[i1]+" "+xs[i2]+" "+ys[i2]+"\" stroke=\"black\" stroke-width="+linewidth+" fill=\"none\"/><text x="+(xs[i1]+xs[i2])/2+" y="+(ys[i1]+ys[i2])/2+" fill=\"red\" onclick=\"editEdge(this)\">"+edgeNote+"</text>";

});

function editEdge(o){
  if (confirm("Do you want to delete this Edge?") == true){
    o.parentNode.removeChild(o.previousSibling);
    o.parentNode.removeChild(o);
  }
}

function  changeContent(obj){
  o.innerHTML = obj.previousSibling.val();
}