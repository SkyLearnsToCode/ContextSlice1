d3.select("svg").select(".inner").selectAll("line")
.on("click", console.log($(this)));
//.delegate("line","click",function(d) {
//		console.log("double click links");
		//var newText = window.prompt("Enter the connection", "");
		/*d3.select(this.parentEdge).select('text')
			.text(function(d){
				return newText;
			})*/
	//});