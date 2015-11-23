$(document).ready(function(){
  $.getJSON( "parsed_documents.json", function( json_res ) {
    $("#document-paragraph").append(String(json_res["Documents"][0]["DocText"]))
  });
});

//Step 1
//displays the currently selected entityList in the textarea box
function displayCategoryEntityListInSummary (category){
	var description = "";
	var li1 = "<li class=\"list-group-item\">";
	var li2 = "</li>\n"
	var entities = $("em."+category);
	var display = "";
	$("#summary-cat").html("Category:\t"+category+" ("+entities.length+")");
	for (i = 0; i<entities.length; i++){
		if(category=="other"){
			var class_names = entities[i].className.split(" ");
			description = " ("+class_names[class_names.length-1]+")";
		}
		display += li1+entities[i].innerHTML+description+li2;
	}
	$("#category-display").html(display);
}

//Step 1
//makes sure that the element within the paragraph element no longer has the
//entity class or anything else.
function cancelCurrent(event){
	var currentEntity = $(this).html().toString();
	var class_name = $(this).attr('class').split(" ")[2];
	var separate = currentEntity.split(" ");
	var newEntity = "";
	var parent = $(this).parent();
	for (word in  separate){
		newEntity += separate[word]
		if(word != separate.length -1){
			newEntity += " ";
		}
	}
	$(this).replaceWith(newEntity);
	parent[0].normalize();
	displayCategoryEntityListInSummary(class_name);
}

//gets the user's highlighted words, adds them
//QUESTION what is the else part doing here?
function addNewEntity(event){
	var class_name = $(this).html();
	var entitySelect = document.getSelection();
	var entityStr = entitySelect.toString();
	if(entitySelect.rangeCount && entityStr!=""){
		var entityRange = entitySelect.getRangeAt(0);
		var entityNode = document.createElement("em");
		entityNode.className = "entity highlight "+class_name;
		var other = "";
		if (class_name == "other"){
			other = $("#other-description").val();
			entityNode.className += " "+other;
		}
		entityNode.appendChild(document.createTextNode(entityStr));
		entityRange.deleteContents();
		entityRange.insertNode(entityNode);
	}
	displayCategoryEntityListInSummary(class_name);
}


//Step 1
//appends the a new button category to #catGroup div
/*
function addCategory(event){
	$("#errorAlert").html("");
	var cateName = $("input#newCat").val();
	var existing = $("#catGroup button");
	var add = true;
	for (var n = 0; n < existing.length; n++){
		if (cateName.toString().toLowerCase() === existing[n].innerHTML.toString().toLowerCase()){
			var alertBanner = "<div class=\"alert alert-warning\"><strong>Error!</strong> This category already exists.</div>";
			add = false;
			$("#errorAlert").html(alertBanner);
			break;
		}
	}
	if(add && cateName!=""){
		$("#catGroup").append($('<button/>', {
	        text: cateName,
	        class: "btn btn-sm legend "+cateName
    	}))
	}
	$("input#newCat").val("");
}
*/

//Toggles the category highlighting of words in the paragraph document
/*
function toggleCat(event){
	var htmlClassString = $(this).html().toString();

	if ($("em#"+htmlClassString).is("."+htmlClassString)){
		$("em#"+htmlClassString).removeClass(htmlClassString);
	}else{
		$("em#"+htmlClassString).addClass(htmlClassString);
	}
}
*/

//Alternative to toggleCat(event)
function toggleCategoryHighlight(event){
	var category = $(this).html().toString();
	$("em."+category).toggleClass("highlight");
}

//Show all category highlight
/*
$("button._ALL").click(function(){
	if ($(this).is("._SHOW")){
		for (var i = 0; i < $("em").length; i++){
			$($("em").get(i)).addClass($($("em").get(i)).attr("id"));
		}
	}else{
		$("em").removeClass();
	}
})
*/

//Show/Hide all category highlight
function toggleAllHighlight(event){
	$("em").toggleClass("highlight");
	$(this).toggleClass("btn-info");
	if($("em").is(".highlight")){
		$(this).html("Hide");
	}else{
		$(this).html("Show");
	}
}

function goBack(event){
	document.write("<h1>Thank you!</h1><h3>Redirecting to Mechanical Turk...</h3>");
}

//on double click, cancelCurrent gets called for any element within the paragraph document
//that has the class entity
$("p").delegate(".entity","dblclick", cancelCurrent);

//switches the entity list to show entities of that category
$("div").delegate(".legend","click", addNewEntity);

//appends the a new button category to #catGroup div based on addCate button
//$("#addCate").on("click",addCategory);

//attaches toggleCategory handler to any 'li' AND 'category' element for onclick event
$("li").delegate(".category","click",toggleCategoryHighlight);

//attach toggleAllHighlight handler our '.toggleAllHighlight' button in 'li' element for onclick event
$("li").delegate("button.toggleAllHighlight","click",toggleAllHighlight);

//redirects for the worker
$("#finish").on("click",goBack);
