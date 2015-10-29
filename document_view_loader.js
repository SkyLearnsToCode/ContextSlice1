$(document).ready(function(){
  $.getJSON( "parsed_documents.json", function( json_res ) {
    $("#document-paragraph").append(String(json_res["Documents"][0]["DocText"]))
  });
});
