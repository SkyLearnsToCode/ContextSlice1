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

var width = 700,
    height = 700;

// mouse event vars
var selected_node = null,
    selected_link = null

//var color = d3.scale.category20();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .gravity(.05)
    .distance(100)
    .charge(-100)
    .size([width, height]);

var svg = d3.select("#graph-editor").append("svg")
.attr("width", width)
.attr("height", height);

d3.json("graph.json", function(error, json) {
  if (error) throw error;

  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link");

  var node = svg.selectAll(".node")
      .data(json.nodes)
      .enter().append("g")
      .on("click", click)
      .attr("class", "node")
      .call(force.drag);
    node.append("circle")
      .attr("r", 5)
      .attr("class", function(d) { return d.category; });


  // node.append("image")
  //     .attr("xlink:href", "https://github.com/favicon.ico")
  //     .attr("x", -8)
  //     .attr("y", -8)
  //     .attr("width", 16)
  //     .attr("height", 16);

  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });

  // action to take on mouse click
  function click() {
      d3.select(this).select("circle").transition()
          .duration(750)
          .attr("r", 16)
          .style("fill", "lightsteelblue");
  }
});
