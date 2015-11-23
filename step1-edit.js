$(document).ready(function(){
  $.getJSON( "parsed_documents.json", function( json_res ) {
    $("#document-paragraph").append(String(json_res["Documents"][0]["DocText"]))
  });
});

//<li class=\"list-group-item\"></li>

//Step 1
//displays the currently selected entityList in the textarea box
function displayCategoryEntityListInSummary (category){
	$("#summary-cat").html("Category:\t"+category);
	var li1 = "<li class=\"list-group-item\">";
	var li2 = "</li>\n"
	var entities = $("em."+category);
	for (i = 0; i<entities.length; i++){
		$("#category-display").append(li1+entities[i].innerHTML+li2);
	}
}