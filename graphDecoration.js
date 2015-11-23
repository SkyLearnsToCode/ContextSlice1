//need to change the color according to category
//--> need to add category information in JSON file
/*
var graph_svg = document.getElementById("graph-editor").getElementsByTagName("svg")[0];
var nodes = graph_svg.getElementsByClassName("node");
*/

var highlight_color = "blue";
var highlight_trans = 0.1;

var node = d3.select("body").select("#graph-editor").selectAll(".node");
node.on("dblclick.zoom", function(d) { d3.event.stopPropagation();
	var dcx = (window.innerWidth/2-d.x*zoom.scale());
	var dcy = (window.innerHeight/2-d.y*zoom.scale());
	zoom.translate([dcx,dcy]);
	 g.attr("transform", "translate("+ dcx + "," + dcy  + ")scale(" + zoom.scale() + ")");
	 
	 
	});