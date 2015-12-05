$(document).ready(function(){
    $("h3.doc-header").click(function(){
    	var id = $(this).html();
        $("#"+id+".collapse").collapse('toggle');
    });

    $(".doc-collapse").click(function () {
    	if ($(this).html() == "Display All"){
    		$(this).html("Collapse All");
    	}else{
    		$(this).html("Display All");
    	}
    	$(".collapse").collapse('toggle');
    });
    //opens editor when edge is clicked and collapses when OK button is pressed
 // makes a temporary button for what would be the node
   $("button.edit").click(function(){
    if ($(this).html() == "Expand"){
            $(this).html("Collapse");
            $("#edit-panel.collapse").collapse('show');
        }else{
            $(this).html("Expand");
        } 
    });
   
   $("#ok").click(function(){
    $("#edit-panel.collapse").collapse('hide');
    $("button.edit").html("Expand");
   })
});