d3.select(".link")
	.on("dblclick", function(d) {
		console.log("double click links");
	  var newText = window.prompt("Enter the connection", "");
	  d3.select(this.parentEdge).select('text')
	  .text(function(d){
	  return newText;
	})
	});