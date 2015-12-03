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

// global variables
var width = 700,
    height = 700,
    //fill = d3.scale.category20(),
    d3_json;

// mouse event vars
var selected_node = null,
    selected_link = null;


//the d3 global force variable
var force = d3.layout.force()
    .gravity(.05)
    .distance(100)
    .charge(-100)
    .size([width, height])
    .on("tick", tick);

// init svg
var outer = d3.select("#graph-editor")
  .append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", "all");

var svg = outer
  .append("svg:g")
    .call(d3.behavior.zoom().on("zoom", rescale))
    .on("dblclick.zoom", null)
  .append("svg:g")
    .on("mousedown", mousedown)
/*
svg.append('svg:rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'white');
*/
var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");


function mousedown() {
  if (!selected_node) {
    // allow panning if nothing is selected
    svg.call(d3.behavior.zoom().on("zoom"), rescale);
    return;
  }
}

var jsonfile = "graph_small.json";
d3.json(jsonfile, function(error, json) {
  if (error) throw error;

  d3_json = json;
  update();
});

// rescale g
function rescale() {
  trans=d3.event.translate;
  scale=d3.event.scale;

  svg.attr("transform",
      "translate(" + trans + ")"
      + " scale(" + scale + ")");
}

function update() {

  //restart the force layout by using the force object
  force
    .nodes(d3_json.nodes)
    .links(d3_json.links)
    .start();

  //update the links
  link = svg.selectAll(".link")
      .data(d3_json.links)
    .enter().append("line")
      .attr("class", "link");

  //update the nodes
  node = svg.selectAll(".node")
      .data(d3_json.nodes)
      .enter().append("g")
      .on("click", node_click)
      .attr("class", "node")
      .call(force.drag);

    node.append("circle")
      .attr("r", 10)
      .attr("class", function(d) { return d.category; });

  //add an image to the circle
  // node.append("image")
  //     .attr("xlink:href", "https://github.com/favicon.ico")
  //     .attr("x", -8)
  //     .attr("y", -8)
  //     .attr("width", 16)
  //     .attr("height", 16);
  //add text label to the nodes
  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });

  if(d3.event) {
    d3.event.preventDefault();
  }

  node.classed("node_selected", function(d) {
    return d === selected_node;
  });
}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
}


// action to take on mouse click of a node
function node_click(d) {

  // console.log(d)

  // d.classed("node_selected")
  // console.log(d3.select(this))
  // console.log(d3.select(this).node());
  console.log(d);
  d3.select(this).classed("node_selected", selected_node === d);
  if(selected_node == d){
    selected_node = null;
  }else{
    selected_node = d;
  }

  // d.transition()
  //   .duration(750)
  //   .attr("r", 16)
  //   .style("fill", "lightsteelblue");

  // d3.select(this).select("circle").transition()
  //     .duration(750)
  //     .attr("r", 16)
  //     .style("fill", "lightsteelblue");
  // update();
}
