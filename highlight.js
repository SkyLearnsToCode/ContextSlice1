var colorMap = {
	person : "#FFFF00",
	location : "#B8860B",
	organization : "#FF00FF",
	money : "#32CD32",
	miscellanea : "#FFBF00",
	phone : "#A9A9F5",
	interesting : "#FF6347",
	date : "#00CED1",
	other : "#4B0082",
	unused : "#FF0000"
}

//makes sure that the element within the paragraph element no longer has the
//entity class or anything else.
function cancelCurrent(event){
	var currentEntity = $(this).html().toString();
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
}

//displays the currently selected entities in the textarea box
function displayCategoryEntitiesInSummary (category){
	$("#summary-cat").html("Category["+category+"]: ");
	var entityList = "";
	var cateEntities = $("em."+category);
	for (i = 0; i<cateEntities.length; i++){
		entityList += cateEntities[i].innerHTML;
		entityList+="\n"
	}
	$("textarea").html(entityList);
}

//gets the user's highlighted words, adds them
//QUESTION what is the else part doing here?
function addNewEntity(event){
	var classN = $(this).html();
	if (window.getSelection) {  // all browsers, except IE before version 9
		var entitySelect = document.getSelection();
		var entityStr = entitySelect.toString();
		if(entitySelect.rangeCount && entityStr!=""){
			var entityRange = entitySelect.getRangeAt(0);
			var entityNode = document.createElement("em");
			entityNode.className = "entity "+classN;
			entityNode.appendChild(document.createTextNode(entityStr));
			entityRange.deleteContents();
			entityRange.insertNode(entityNode);
		}
	}
	else{
		if (document.selection && document.selection.createRange) { // Internet Explorer
	    	var entitySelect = document.selection.createRange();
	    	var entityStr = entitySelect.text;
	    }
	}
	displayCategoryEntitiesInSummary(classN);
	if ($('input[name="editType"]:checked').val() == "cat"){
		addNewEntity(event);
	}
}


//appends the a new button category to #catGroup div
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


//Toggles the category highlighting of words in the paragraph document
function toggleCat(event){
	var htmlClassString = $(this).html().toString();

	if ($("em#"+htmlClassString).is("."+htmlClassString)){
		$("em#"+htmlClassString).removeClass(htmlClassString);
	}else{
		$("em#"+htmlClassString).addClass(htmlClassString);
	}
}

$("button._ALL").click(function(){
	if ($(this).is("._SHOW")){
		for (var i = 0; i < $("em").length; i++){
			$($("em").get(i)).addClass($($("em").get(i)).attr("id"));
		}
	}else{
		$("em").removeClass();
	}
})

function goBack(event){
	document.write("<h1>Thank you!</h1><h3>Redirecting to Mechanical Turk...</h3>");
}

//on double click, cancelCurrent gets called for any element within the paragraph document
//that has the class entity
$("p").delegate(".entity","dblclick", cancelCurrent);

//switches the entity list to show entities of that category
$("div").delegate(".legend","click", addNewEntity);

//appends the a new button category to #catGroup div based on addCate button
$("#addCate").on("click",addCategory);

//attaches toggleCat handler to any 'li' AND 'category' element for onclick event
$("li").delegate(".category","click",toggleCat)

//redirects for the worker
$("#finish").on("click",goBack);
