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
    var labels = ["Not Important At All","Of Little Importance","Of Average Importance","Very Important","Absolutely Essential"];
    $("#impSlider").change(function() {
        var impRate = $(this).val()-1;
        if (impRate != 0 && impRate != 4){
            $("#importance").html(labels[impRate]);
            $("#importance").css("margin-left",35+impRate*8+"%");
        }else{
            $("#importance").html("");
        }
    });
});

//Alternative to toggleCat(event)
function toggleCategoryHighlight(event){
    var category = $(this).attr("class").split(" ")[2];
    if (category == "Miscellaneous"){
        category = "Misc";
    }
    $("em."+category).toggleClass("highlight");
    $("button."+category).toggleClass("unchecked");
}

function toggleAllHighlight(event){
    if ($(this).text() == "Hide All Category Highlight"){
        $("em").removeClass("highlight");
        $(this).html("Show All Category Highlight");
        $("button.category").addClass("unchecked");
    }else{
        $("em").addClass("highlight");
        $(this).html("Hide All Category Highlight");
        $("button.category").removeClass("unchecked");
    }
    $(this).toggleClass("unchecked");
}

function showInstructions(event){
    $("button#fadeIn").hide();
    $("div#instructions").fadeIn("slow");
}

//attach toggleAllHighlight handler our '.toggleAllHighlight' button in 'li' element for onclick event
$("div#legend").delegate("button.All","click",toggleAllHighlight);
$("div#legend").delegate("button.category","click",toggleCategoryHighlight);
$("div#doc-contents").delegate("button#fadeIn","click",showInstructions);