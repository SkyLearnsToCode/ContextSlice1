$(document).ready(function(){
    $("h3.doc-header").click(function(){
    	var id = $(this).html();
        $("#"+id+".collapse").collapse('toggle');
    });

    $(".toggle-legend").click(function () {
    	if ($(this).html() == "Hide Legend"){
    		$(this).html("Show Legend");
    	}else{
    		$(this).html("Hide Legend");
    	}
    	$("#legend").collapse('toggle');
    });
    //opens editor when edge is clicked and collapses when OK button is pressed
 // makes a temporary button for what would be the node
   $("button.edit").click(function(){
    if ($(this).html() == "Create New Links"){
            $(this).css("visibility", "hidden");
            $("#edit-panel.collapse").collapse('show');
        }else{
            $(this).html("Create New Links");
        }
    });

   $("button.btn-default").click(function(){
    $("#edit-panel.collapse").collapse('hide');
    $("button.edit").html("Create New Links").css("visibility", "visible");
   })
});

//Alternative to toggleCat(event)
function toggleCategoryHighlight(event){
    var category = $(this).parent().text().toString();
    if (category == "Miscellaneous"){
        category = "Misc";
    }
    $("em."+category).toggleClass("highlight");
}

function toggleAllHighlight(event){
    $("em").toggleClass("highlight");
    if($("em").is(".highlight")){
        $(this).html("Hide All Category Highlight");
    }else{
        $(this).html("Show All Category Highlight");
    }
}

$("label.legend-label").delegate("div.category","click",toggleCategoryHighlight);

//attach toggleAllHighlight handler our '.toggleAllHighlight' button in 'li' element for onclick event
$("div#doc-contents").delegate("button.toggle-highlight","click",toggleAllHighlight);
