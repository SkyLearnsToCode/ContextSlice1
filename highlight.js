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
	$(this).before(newEntity);
	$(this).remove();
}

function displayCategory (category){
	alert(category);
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
	var classN = $(this).text();
	if (window.getSelection) {  // all browsers, except IE before version 9
		var entitySelect = document.getSelection();                                       
		//alert (range.toString ());
		if(entitySelect.rangeCount){
			var entityStr = entitySelect.toString(); 
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
	    	//alert (range.text);
	    }
	}
	displayCategory(classN);
		//alert(entity.anchorNode.appendChild(entity.anchorNode));
		//toString().anchor()
}

$("p").delegate(".entity","dblclick", cancelCurrent);
$("div").delegate(".legend","click", addNewCat);
