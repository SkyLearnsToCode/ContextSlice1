$(document).ready(function(){
  $.getJSON( "document.json", function( json_res ) {
    $("#doc-contents")
    .append(String(json_res["Documents"][0]["DocText"]))
  });
});
