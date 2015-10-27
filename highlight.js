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

function cancelCurrent(event){
	//event.preventDefault();
	var currentEntity = $(this).html().toString();
	var separate = currentEntity.split(" ");
	var newEntity = "";
	var parent = $(this).parent();
	for (word in  separate){
		//newEntity += separate[word].anchor(word);
		newEntity += separate[word]
		if(word != separate.length -1){
			newEntity += " ";
		}
	}
	//$(this).before(newEntity);
	$(this).replaceWith(newEntity);
	parent[0].normalize();
}

function displayCategory (category){
	$("#summary-cat").html("Category["+category+"]: ");
	var entityList = "";
	var cateEntities = $("em."+category);
	for (i = 0; i<cateEntities.length; i++){
		entityList += cateEntities[i].innerHTML;
		entityList+="\n"
	}
	$("textarea").html(entityList);
}

function addNewCat(event){
	//event.preventDefault();
	var classN = $(this).html();
	if (window.getSelection) {  // all browsers, except IE before version 9
		var entitySelect = document.getSelection(); 
		var entityStr = entitySelect.toString();  
		//alert(entitySelect.rangeCount);                                     
		if(entitySelect.rangeCount && entityStr!=""){
			var entityRange = entitySelect.getRangeAt(0);
			//alert(entityRange);
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
	    	//alert (range.text);
	    }
	}
	displayCategory(classN);
	if ($('input[name="editType"]:checked').val() == "cat"){
		addNewCat(event);
	}
	//addNewCat(event);
		//alert(entity.anchorNode.appendChild(entity.anchorNode));
		//toString().anchor()
}

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

function goBack(event){
	document.write("<h1>Thank you!</h1><h3>Redirecting to Mechanical Turk...</h3>");
}

function toggleCat(event){
	var cls = $(this).html().toString();
	
	if ($("em#"+cls).is("."+cls)){
		$("em#"+cls).removeClass(cls);
	}else{
		$("em#"+cls).addClass(cls);
	}
  //$("em").toggleClass(cls);
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

$("p").delegate(".entity","dblclick", cancelCurrent);
$("div").delegate(".legend","click", addNewCat);
$("#addCate").on("click",addCategory);
$("#finish").on("click",goBack);
$("li").delegate(".category","click",toggleCat)

