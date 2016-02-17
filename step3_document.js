$(document).ready(function(){
    $("h3.doc-header").click(function(){
    	var id = $(this).html();
        $("#"+id+".collapse").collapse('toggle');
    });

    $(".toggle-legend").click(function () {
    	if ($(this).html() == "Hide Legend"){
    		$(this).html("Show Legend");
            $("button.All").fadeOut();
    	}else{
    		$(this).html("Hide Legend");
            $("button.All").fadeIn();
    	}
    	$("#legend").collapse('toggle');
    });
    //opens editor when edge is clicked and collapses when OK button is pressed
 // makes a temporary button for what would be the node
   $("button.edit").click(function(){
    if ($(this).html() == "Create New Links"){
            $(this).html("Hide Edit Panel");
            $("#edit-panel.collapse").collapse('show');
        }else{
            $(this).html("Create New Links");
            $("#edit-panel.collapse").collapse('hide');
        }
    });
/*
   $("#cancel").click(function(){
    $("#edit-panel.collapse").collapse('hide');
    $("button.edit").html("Create New Links").css("visibility", "visible");
   })
*/
   $("button#fadeOut").click(function(){
    $("div#instructions").fadeOut("fast",function(){
        $("button#fadeIn").fadeIn();
    });
   });
    var labels = ["Not Important At All","Of Little Importance","Of Average Importance","Very Important","Absolutely Important"];
    $("#impSlider").change(function() {
        var impRate = $(this).val()-1;
        $("#importance").html(labels[impRate]);
    });
});

//Alternative to toggleCat(event)
function toggleCategoryHighlight(event){
    var classnames = $(this).attr("class").split(" ");
    var category = classnames[classnames.length-2];
    if (category == "category"){
        category = classnames[classnames.length-1];
    }
    if (category == "Miscellaneous"){
        category = "Misc";
    }
    if (classnames[classnames.length-1] != "highlight"){
        $("."+category).addClass("highlight");
    }else{
        $("."+category).removeClass("highlight");
    }
    //$("button."+category).toggleClass("unchecked");
}

function toggleAllHighlight(event){
    if ($(this).text() == "Hide All Category Highlight"){
        $("em").removeClass("highlight");
        $(this).html("Show All Category Highlight");
        $("button.category").removeClass("highlight");
    }else{
        $("em").addClass("highlight");
        $(this).html("Hide All Category Highlight");
        $("button.category").addClass("highlight");
    }
    //$(this).toggleClass("unchecked");
}

function showInstructions(event){
    $("button#fadeIn").hide();
    $("div#instructions").fadeIn("slow");
}

//attach toggleAllHighlight handler our '.toggleAllHighlight' button in 'li' element for onclick event
$("div#doc-contents").delegate("button.All","click",toggleAllHighlight);
$("div#legend").delegate("button.category","click",toggleCategoryHighlight);
$("div#doc-contents").delegate("button#fadeIn","click",showInstructions);