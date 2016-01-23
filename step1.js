$(document).ready(function(){
  $.getJSON( "parsed_documents.json", function( json_res ) {
    $("#document-paragraph").append(String(json_res["Documents"][0]["DocText"]))
  });
  $("input#new-category").val("");
});

//displays the currently selected entityList in the textarea box
function displayCategoryEntityListInSummary (category){
	var description = "";
	var li1 = "<li class=\"list-group-item\">";
	var li2 = "</li>\n"
	var entities = $("em."+category);
	var display = "";
	$("#category-placeholder").html(category+":\t"+" "+entities.length+" entities");
	for (i = 0; i<entities.length; i++){
		if(category=="Other"){
			var class_names = entities[i].className.split(" ");
			description = " ("+class_names[class_names.length-1]+")";
		}
		display += li1+entities[i].innerHTML+description+li2;
	}
	$("#entity-list").html(display);
}

//makes sure that the element within the paragraph element no longer has the
//entity class or anything else.
function cancelCurrent(event){
	var currentEntity = $(this).html().toString();
	console.log(currentEntity);
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
function addNewEntity(event){
	event.preventDefault();
	var class_name = $(this).attr("class").split(" ")[2];
	
	var entitySelect = document.getSelection();
	var entityStr = entitySelect.toString();
	if(entitySelect.rangeCount && entityStr!=""){
		var entityRange = entitySelect.getRangeAt(0);
		var entityNode = document.createElement("em");
		entityNode.className = "entity highlight "+class_name;
		if (class_name == "Other"){
			console.log(class_name);
			entityNode.className += " "+$("input#new-category").val();
		}
		entityNode.appendChild(document.createTextNode(entityStr));
		entityRange.deleteContents();
		entityRange.insertNode(entityNode);
	}
	displayCategoryEntityListInSummary(class_name);
	document.getSelection().removeAllRanges();
	$("input#new-category").val("");
}

$("fieldset").delegate("button.category","click", addNewEntity);
$("p#document-paragraph").delegate(".entity","dblclick", cancelCurrent);