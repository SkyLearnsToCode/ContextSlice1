$(document).ready(function(){
  $.getJSON( "parsed_documents.json", function( json_res ) {
    $("#document-paragraph").append(String(json_res["Documents"][0]["DocText"]))
  });
  $("input#new-category").val("");
});

//displays the currently selected entityList in the textarea box
function displayCategoryEntityListInSummary (category){
	var description = "";
	var li = document.createElement("li");
	var span = document.createElement("span");
	span.className = "list-group-item";
	var input = document.createElement("input");
	input.type = "text";
	input.className = "list-item-edit";
	input.setAttribute("style","display:none");

	//var li1 = "<li class=\""+category+"\"><span class=\"list-group-item\">";
	//var li2 = "</span><input type=\"text\" class=\"list-item-edit\" style=\"display:none\"/></li>\n"
	var entities = $("em."+category);
	var currentName = "";
	//var display = "";
	$("#category-placeholder").html(category+":\t"+" "+entities.length+" entities");
	for (i = 0; i<entities.length; i++){
		currentName = entities[i].innerHTML.trim();
		if(category=="Other"){
			var class_names = entities[i].className.split(" ");
			description = " ("+class_names[class_names.length-1]+")";
		}
		//display += li1+entities[i].innerHTML.trim()+description+li2;
		li.className = category+" "+currentName;
		input.className = "list-item-edit "+currentName;
		span.innerHTML = currentName;
		li.appendChild(span);
		li.appendChild(input);
		console.log(li);
	}
	$("ul").hide();
	$("ul#entity-list-"+category).show().append(li);
}

//makes sure that the element within the paragraph element no longer has the
//entity class or anything else.
function cancelCurrent(event){
	var currentEntity = $(this).html().toString().trim();
	var class_name = $(this).attr('class').split(" ")[2];
	/*
	var separate = currentEntity.split(" ");
	var newEntity = "";
	var parent = $(this).parent();
	for (word in  separate){
		newEntity += separate[word]
		if(word != separate.length -1){
			newEntity += " ";
		}
	}*/
	$(this).replaceWith(currentEntity);

	//$(this).parent()[0].normalize();
	displayCategoryEntityListInSummary(class_name);
}

//gets the user's highlighted words, adds them
function addNewEntity(event){
	event.preventDefault();
	var class_name = $(this).attr("class").split(" ")[2];
	
	var entitySelect = document.getSelection();
	var entityStr = entitySelect.toString().trim();
	if(entitySelect.rangeCount && entityStr!=""){
		var entityRange = entitySelect.getRangeAt(0);
		var entityNode = document.createElement("em");
		entityNode.className = "entity highlight "+class_name+" "+entityStr;
		if (class_name == "Other"){
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

//edit category list
function editList(event){
	console.log("editList");
	$(this).hide();
	$(this).siblings(".list-item-edit").show().val($(this).text()).focus();
}

//finish editing list itme
function editListDone(event){
	var currentEntityStr = $(this).parent().attr("class");
	currentEntityStr = currentEntityStr.slice(currentEntityStr.indexOf(" ")+1);
	console.log(currentEntityStr);
	if ($(this).val().replace(/\s+/g, '') == "") {
		$(this).parent().remove();
		$("em."+currentEntityStr.replace(/\ /g, '.')).replaceWith(currentEntityStr);
		//displayCategoryEntityListInSummary(class_name);
	}else{
		$(this).hide();  
		$(this).siblings(".list-group-item").show().text($(this).val());
	}
}

$("fieldset").delegate("button.highlight","click", addNewEntity);
$("p#document-paragraph").delegate(".entity","dblclick", cancelCurrent);
$("ul").delegate("span.list-group-item","click", editList);
$("ul").delegate("input.list-item-edit","focusout", editListDone);