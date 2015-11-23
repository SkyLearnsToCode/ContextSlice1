$(document).ready(function(){
    $("h3.doc").click(function(){
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
    })
});