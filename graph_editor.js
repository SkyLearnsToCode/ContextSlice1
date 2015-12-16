var colorMap = {
  person : "#FFFF00",
  location : "#B8860B",
  organization : "#FF00FF",
  money : "#32CD32",
  miscellanea : "#FFBF00",
  phone : "#A9A9F5",
  interesting : "#FF6347",
  date : "#00CED1",
  other : "#f2a6df"
}

var margin = {top: -5, right: -5, bottom: -5, left: -5};
var width = 700,
    height = 700,
    fill = d3.scale.category20();

// mouse event vars
var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null,
    clicked_flag = false;

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

// init svg
var svg = d3.select("#graph-editor")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
    .call(zoom);
    // .attr("pointer-events", "all");

// var rect = svg.append("rect")
//     .attr("width", width)
//     .attr("height", height)
//     .style("fill", "none")
//     .style("pointer-events", "all");

// var container = svg.append("g");

// var min_zoom = 0.1;
// var max_zoom = 7;
// svg.call (d3.behavior.zoom()
//     .translate ([0, 0])
//     .scale (1.0)
//     .scaleExtent([min_zoom, max_zoom])
//     .on("zoom", rescale)
// );


var vis = svg.append('g');



function zoomed() {
  vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragged(d) {
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}



// // rescale g
// function rescale() {
//   trans=d3.event.translate;
//   scale=d3.event.scale;
//
//   vis.attr("transform",
//       "translate(" + trans + ")"
//       + " scale(" + scale + ")");
// }





// outer.call(zoom);

// var child = vis.append('g');
// child.call(zoom);
// vis.call(zoom);
// var vis = outer
  // .append('g')
    // .call(d3.behavior.zoom().on("zoom", rescale))
    // .on("dblclick.zoom", null)
  // .append('svg:g')
    // .on("mousemove", mousemove)
    // .on("mousedown", mousedown)
    // .on("mouseup", mouseup);

// vis.append('svg:rect')
//     .attr('width', width)
//     .attr('height', height)
//     .attr('fill', 'white');

// line displayed when dragging new nodes
// var drag_line = vis.append("line")
//     .attr("class", "drag_line")
//     .attr("x1", 0)
//     .attr("y1", 0)
//     .attr("x2", 0)
//     .attr("y2", 0);


var force;
var d3_data;
var jsonfile = "graph_small.json";
var nodes, links, node, link;


// add keyboard callback
d3.select(window)
    .on("keydown", keydown);


// focus on svg
// vis.node().focus();

// function mousedown() {
//   if (!mousedown_node && !mousedown_link) { //TODO just need to make sure these are set before dragging
//     // allow panning if nothing is selected
//     vis.call(d3.behavior.zoom().on("zoom"), rescale);
//     return;
//   }
// }

// function mousemove() {
//   if (!mousedown_node) return;
//
//   // update drag line
//   drag_line
//       .attr("x1", mousedown_node.x)
//       .attr("y1", mousedown_node.y)
//       .attr("x2", d3.svg.mouse(this)[0])
//       .attr("y2", d3.svg.mouse(this)[1]);
// }

// function mouseup() {
//   if (mousedown_node) {
//     // hide drag line
//     drag_line
//       .attr("class", "drag_line_hidden")
//
//     if (!mouseup_node) {
//       // add node
//       var point = d3.mouse(this),
//         node = {x: point[0], y: point[1]},
//         n = nodes.push(node);
//
//       // select new node
//       selected_node = node;
//       selected_link = null;
//
//       // add link to mousedown node
//       links.push({source: mousedown_node, target: node});
//     }
//
//     redraw();
//   }
//   // clear mouse event vars
//   resetMouseVars();
// }

function resetMouseVars() {
  mousedown_node = null;
  mouseup_node = null;
  mousedown_link = null;
}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}




d3.json(jsonfile, function(json) {

  d3_data = json;

  force = d3.layout.force()
    .gravity(.05)
    .distance(100)
      .size([width, height])
      .nodes(d3_data.nodes) // initialize with a single node
      .links(d3_data.links)
      // .charge(function(node){
      //   return  parseInt(node.docid)*(-100);
      // })
      .on("tick", tick);

  node = vis.append("g").selectAll(".node");
  link = vis.selectAll(".link");
  nodes = force.nodes();
  links = force.links();


  redraw();
});


// redraw force layout
function redraw() {
  force.charge(-100).start();

  nodes = force.nodes();
  links = force.links();

  link = link.data(links);

  link.enter().insert("line", ".node")
      .attr("id", function(d){
        return d.source.name + " to " + d.target.name;
      })
      .attr("class", function(d){
        return "link "+d.value;
      })
      .on("click", edge_click)
      .on("mouseover",handleMouseOver)
      .on("mouseout",handleMouseOut)
      .on("mousedown", function(d) {
          mousedown_link = d;
          if (mousedown_link == selected_link) selected_link = null;
          else selected_link = mousedown_link;
          selected_node = null;
          redraw();
        });



  link.exit().remove();

  link
    .classed("link_selected", function(d) { return d === selected_link; });

  node = node.data(nodes);



  var node_group = node.enter().append("g")
      .attr("class", function(d){
        return "node " + d.category + " "+d.docid;
      });
  node_group.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) {
        return d.name;
      });
  node_group.append("circle")
      .attr("r", 5)
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      // .on("mousedown",
      //   function(d) {
      //     // vis.call(d3.behavior.zoom().on("zoom"), null);
      //   })
      // .on("mouseup",
      //   function(d) {
      //     // vis.call(d3.behavior.zoom().on("zoom"), rescale);
      //   })
      .call(drag)

      // .on("mousedown",
      //   function(d) {
      //     // disable zoom
      //     vis.call(d3.behavior.zoom().on("zoom"), null);
      //
      //     mousedown_node = d;
      //     if (mousedown_node == selected_node) selected_node = null;
      //     else selected_node = mousedown_node;
      //     selected_link = null;
      //
      //     // reposition drag line
      //     drag_line
      //         .attr("class", "link")
      //         .attr("x1", mousedown_node.x)
      //         .attr("y1", mousedown_node.y)
      //         .attr("x2", mousedown_node.x)
      //         .attr("y2", mousedown_node.y);
      //
      //     redraw();
      //   })
      // .on("mousedrag",
      //   function(d) {
      //     // redraw();
      //   })
      // .on("mouseup",
      //   function(d) {
      //     if (mousedown_node) {
      //       mouseup_node = d;
      //       if (mouseup_node == mousedown_node) { resetMouseVars(); return; }
      //
      //       // add link
      //       var link = {source: mousedown_node, target: mouseup_node};
      //       links.push(link);
      //
      //       // select new link
      //       selected_link = link;
      //       selected_node = null;
      //
      //       // enable zoom
      //       vis.call(d3.behavior.zoom().on("zoom"), rescale);
      //       redraw();
      //     }
      //   })
    .transition()
      .duration(750)
      .ease("elastic")
      .attr("r", 6.5);


  node
    .classed("node_selected", function(d) { return d === selected_node; });

  node.exit().transition()
      .attr("r", 0)
    .remove();

  if (d3.event) {
    // prevent browser's default behavior
    d3.event.preventDefault();
  }
}





// action to take on mouse click of an edge
function edge_click(d){
  if (clicked_flag == false){
    clicked_flag = true;
    var source = d.source.name;
    var target = d.target.name;
    var edge_decription = window.prompt("How is "+source+" related to "+target+" ?", "Edge Description Here...");

     if (edge_decription != null){
      d3.select(this.parentNode).select("text")
        //.attr("dx", 12)
        //.attr("dy", ".35em")
        .attr("id",this.id)
        .attr("x",(this.x1.baseVal.value+this.x2.baseVal.value)/2)
        .attr("y",(this.y1.baseVal.value+this.y2.baseVal.value)/2)
        .style("fill","black")
        .style("font-size",35)
        .text(edge_decription)
    }
  }else{
    clicked_flag = false;
    d3.select(this.parentNode)
      .selectAll("text").remove();
  }
}


function handleMouseOver(d){
  d3.select(this)
    .style("stroke-width",4)
    .style("stroke","red");
  d3.select(this.parentNode)
    .append("text")
    .attr("id",this.id)
    .attr("class","tmp")
    .attr("x",(this.x1.baseVal.value+this.x2.baseVal.value)/2)
    .attr("y",(this.y1.baseVal.value+this.y2.baseVal.value)/2)
    .style("fill","black")
    .style("font-size",12)
    .text(function(){
      return this.id;
    });
}

function handleMouseOut(d){
  d3.select(this)
    .style("stroke-width",.5)
    .style("stroke","#ccc");
  d3.select(this.parentNode)
    .select("text.tmp").remove();
}


function spliceLinksForNode(node) {
  toSplice = links.filter(
    function(l) {
      return (l.source === node) || (l.target === node); });
  toSplice.map(
    function(l) {
      links.splice(links.indexOf(l), 1); });
}

function keydown() {
  if (!selected_node && !selected_link) return;
  switch (d3.event.keyCode) {
    case 8: // backspace
    case 46: { // delete
      if (selected_node) {
        nodes.splice(nodes.indexOf(selected_node), 1);
        spliceLinksForNode(selected_node);
      }
      else if (selected_link) {
        //TODO remove the text from the moused over link
        links.splice(links.indexOf(selected_link), 1);
        d3.selectAll("text.tmp").remove();
      }
      selected_link = null;
      selected_node = null;
      redraw();
      break;
    }
  }
}



//
//
//
// var min_zoom = 0.1;
// var max_zoom = 7;
// var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom])
// outer.call(zoom);
// var svg = d3.select("body").append("svg");
//
//
// zoom.on("zoom", function() {
//
//     var stroke = nominal_stroke;
//     if (nominal_stroke*zoom.scale()>max_stroke) stroke = max_stroke/zoom.scale();
//     link.style("stroke-width",stroke);
//     circle.style("stroke-width",stroke);
//
// 	var base_radius = nominal_base_node_size;
//     if (nominal_base_node_size*zoom.scale()>max_base_node_size) base_radius = max_base_node_size/zoom.scale();
//         circle.attr("d", d3.svg.symbol()
//         .size(function(d) { return Math.PI*Math.pow(size(d.size)*base_radius/nominal_base_node_size||base_radius,2); })
//         .type(function(d) { return d.type; }))
//
// 	//circle.attr("r", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); })
// 	if (!text_center) text.attr("dx", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); });
//
// 	var text_size = nominal_text_size;
//     if (nominal_text_size*zoom.scale()>max_text_size) text_size = max_text_size/zoom.scale();
//     text.style("font-size",text_size + "px");
//
// 	g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
// 	});
//
//   svg.call(zoom);
