var filenames = ["sample_sameperson.json","sample_freqrank.json","sample_adj.json","sample_termadj.json"];
$(document).ready(function(){
  /*
  var colorMap = {
    person : "#FFFF00",
    location : "#B8860B",
    organization : "#FF00FF",
    money : "#32CD32",
    miscellanea : "#FFBF00",
    phone : "#A9A9F5",
    interesting : "#FF6347",
    date : "#00CED1",
    other : "#f2a6df"
  }}*/

  // width and height of graph edit svg
  var width = 700,
      height = 700;

  // mouse event vars
  var selected_node_1 = null,
      selected_node_2 = null,
      mousedown_node = null,
      mouseup_node = null, //maybe not

      selected_link = null,
      current_link = null, //potential links between two selected nodes
      mousedown_link = null,
      
      
      clicked_flag = false, //not in use
      clicked_node = 1; //not used

  // drop-down list for node selection
  var selectNode1Form, selectNode2Form;

  // init svg
  var outer = d3.select("#graph-editor")
    .append("svg:svg")
      .attr("width","100%")
      .attr("height",height)
      .attr("pointer-events", "all");

  // zoom & pan the whole graph
  var zoom = d3.behavior.zoom().scaleExtent([0.2, 8]).on("zoom", rescale);
  var vis = outer
    .append('svg:g')
      .call(zoom)
      .on("dblclick.zoom", null)
    .append('svg:g')
      // .on("mousemove", mousemove);
      .on("mousedown", mousedown);
      // .on("mouseup", mouseup);
  vis.append('svg:rect')
      .attr('width', "100%")
      .attr('height', "100%")
      .attr('fill', 'white');

  /* dropped feature
  // line displayed when dragging new nodes
  var drag_line = vis.append("line")
      .attr("class", "drag_line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", 0);
  */

  var force, drag;
  var d3_data;
  var jsonfile = filenames[0];
  var nodes, links, node, link;
  var edge_decription;

  /* dropped feature
  // add keyboard callback
  d3.select(window)
      .on("keydown", keydown);
  */
  // focus on svg
  // vis.node().focus();

  /* dropped feature
  // function mousemove() {
  //   if (!mousedown_node) return;
  //
  //   // update drag line
  //   drag_line
  //       .attr("x1", mousedown_node.x)
  //       .attr("y1", mousedown_node.y)
  //       .attr("x2", d3.svg.mouse(this)[0])
  //       .attr("y2", d3.svg.mouse(this)[1]);
  // }
  //
  // function mouseup() {
  //   if (mousedown_node) {
  //     // hide drag line
  //     drag_line
  //       .attr("class", "drag_line_hidden")
  //
  //     if (!mouseup_node) {
  //       // add node
  //       var point = d3.mouse(this),
  //         node = {x: point[0], y: point[1]},
  //         n = nodes.push(node);
  //
  //       // select new node
  //       selected_node_1 = node;
  //       selected_link = null;
  //
  //       // add link to mousedown node
  //       links.push({source: mousedown_node, target: node});
  //     }
  //
  //     redraw();
  //   }
  //   // clear mouse event vars
  //   resetMouseVars();
  // }
  //
  */

  d3.json(jsonfile, function(json) {

    d3_data = json;

    // update document contents
    var doc_counter = 0;
    d3_data.contents.forEach(function(curdoc){
      doc_counter ++;
      var doc_contents = curdoc.doctext;
      //var doc_header = curdoc.docheader;
      d3_data.nodes.forEach(function(curnode){
        var entity_name = curnode.name;
        var entity_tag = "<em class=\"highlight "+curnode.category+"\">"+entity_name+"</em>";
        //doc_header = doc_header.replace(entity_name,entity_tag);
        //doc_contents = doc_contents.replace(entity_name,entity_tag);
        doc_contents = doc_contents.split(entity_name).join(entity_tag);
      })
      var outerdiv = d3.select("#doc-contents");
      outerdiv.append("h3")
          .attr("class","panel panel-heading doc-header")
          .html("Document "+doc_counter);
      var innerdiv = outerdiv.append("div")
          .attr("id","Doc"+doc_counter)
          .attr("class","collapse in");
      //innerdiv.append("h5")
      //      .attr("class","panel panel-footer")
      //      .html(doc_header);
      innerdiv.append("p")
          .attr("class","panel panel-body")
          .html(doc_contents);
    })

    // add category highlighting
    var sels = document.getElementsByTagName('em');
    for (i = 0; i < sels.length; i++) {
        //add click listener function 'text_node_select' to all 'em' tags
        sels[i].addEventListener('click', text_node_select, false);
    }

    // click on document header to collapse document texts
    d3.selectAll(".doc-header")
      .on("click",function(){
        var id = $(this).html().split(" ")[1];
        id = "Doc"+id;
        $("#"+id+".collapse").collapse('toggle');
        });

    /*
    d3.selectAll(".doc-collapse")
      .on("click",function () {
        if ($(this).html() == "Display All"){
          $(this).html("Collapse All");
        }else{
          $(this).html("Display All");
        }
        $(".collapse").collapse('toggle');
      });
    */

    //Initialize the node dropdown forms with the incoming graph and their event handlers
    // populate selection lists
    var option_item = [{category: "", name:""}].concat(d3_data.nodes);
    selectNode1Form = d3.select("#node1")
      .on("change", node1form_change);
    selectNode1Form.selectAll("option")
      .data(option_item)
      .enter()
      .append("option")
      .text(function(d){
        return d.name;
      })
      .attr("value", function(d){
        return d.name;
      });
    selectNode2Form = d3.select("#node2")
      .on("change", node2form_change);
    selectNode2Form.selectAll("option")
      .data(option_item)
      .enter()
      .append("option")
      .text(function(d){
        return d.name;
      })
      .attr("value", function(d){
        return d.name;
      });



    force = self.force = d3.layout.force()
        .gravity(.05)
        .distance(200)
        .size([width, height])
        .nodes(d3_data.nodes) // initialize with a single node
        .links(d3_data.links)
        .on("tick", tick);

    drag = d3.behavior.drag()
        .on("dragstart", dragstart)
        .on("drag", dragmove)
        .on("dragend", dragend);

    function dragstart(d, i) {
      force.stop() // stops the force auto positioning before you start dragging
    }
    function dragmove(d, i) {
      d.px += d3.event.dx;
      d.py += d3.event.dy;
      d.x += d3.event.dx;
      d.y += d3.event.dy;
      tick(); // this is the key to make it work together with updating both px,py,x,y on d !
    }

    function dragend(d, i) {
      //d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff

      tick();
      force.resume();
    }

    node = vis.selectAll(".node");
    link = vis.selectAll(".link");
    nodes = force.nodes();
    links = force.links();

    redraw();

    /*
    $("#editRelationship").on("click", function(){

      //not finished
      var tmplink = getLinkFromNodes(selected_node_1,selected_node_2)
      var tmpindex = links.indexOf(tmplink);
      selected_link.description = $("#newNote").val();
      links.splice(tmpindex,1,selected_link);
      selected_node_1 = null;
      selected_node_2 = null;
      redraw();
    });

    $("#createEdge").on("click", function(){
      var newlink = {source: selected_node_1, target: selected_node_2, value: 1, description: $("#newNote").val()};
      if(contains_link(links, newlink) == -1){
        links.push(newlink); //TODO ensure that links does not contain link yet
      }
      selected_node_1 = null;
      selected_node_2 = null;
      //$("#node1").val("");
      //$("#node2").val("");
      redraw();
    })
    */

    //edit panel buttons
    $("#editLink").on("click", function(){
      if ($("p#graph-instructions").hasClass("alert-success")){
        $("p#graph-instructions").removeClass("alert-success");
      }
      if (!$("p#graph-instructions").hasClass("alert-warning")){
        $("p#graph-instructions").addClass("alert-warning");
      }
      $("p#graph-instructions").fadeIn("slow");

      if ($("#node1").val() == "" || $("#node1").val() == ""){
        $("p#graph-instructions").html("Please select 2 nodes to create a link");
        $("#newNote").on("focus",function(){
          $("p#graph-instructions").fadeOut("slow")
        });
        return;
      }else if ($("#newNote").val() == ""){
        $("p#graph-instructions").html("Please specify how the two selected dots are connected in \"Relationship\" field");
        $("#newNote").on("focus",function(){
          $("p#graph-instructions").fadeOut("slow")
        });
        return;
      }

      var notif_message = "";
      current_link = getLinkFromNodes(selected_node_1,selected_node_2);
      
      if (current_link == null || current_link.description == ""){
        notif_message = "New link created between <em class=\"highlight "+selected_node_1.category+"\">"+selected_node_1.name+"</em> and <em class=\"highlight "+selected_node_2.category+"\">"+selected_node_2.name+"</em> with relationship : "+$("#newNote").val();
        current_link = {source: selected_node_1, target: selected_node_2, value: 1, description: $("#newNote").val()};
        links.push(current_link);
      }else{
        notif_message = "<em class=\"highlight "+selected_node_1.category+"\">"+selected_node_1.name+"</em> and <em class=\"highlight "+selected_node_2.category+"\">"+selected_node_2.name+"</em>'s relationship is updated as : "+$("#newNote").val();
      }

      selected_link = current_link;
      selected_link.description = $("#newNote").val();
      var index = links.indexOf(current_link);
      links.splice(index,1,selected_link);

      if ($("p#graph-instructions").hasClass("alert-warning")){
        $("p#graph-instructions").removeClass("alert-warning");
      }
      if (!$("p#graph-instructions").hasClass("alert-success")){
        $("p#graph-instructions").addClass("alert-success");
      }
      $("p#graph-instructions").fadeIn("slow");
      $("p#graph-instructions").html(notif_message);

      reset();
      redraw();
    })

    $("#deleteEdge").on("click", function(){
      links.splice(links.indexOf(selected_link), 1);
      $("p#graph-instructions").fadeIn("slow");
      $("p#graph-instructions").html("Deleted link between <em class=\"highlight "+selected_node_1.category+"\">"+selected_node_1.name+"</em> and <em class=\"highlight "+selected_node_2.category+"\">"+selected_node_2.name+"</em>");

      reset();
      redraw();
    })

    $("#reset").on("click", function(){
      $("p#graph-instructions").fadeOut();
      if (current_link != null && current_link.description == ""){
        links.splice(links.indexOf(current_link),1);
      }
      reset();
      $("#editLink").hide();
      redraw();
    })
  });

  // redraw force layout
  function redraw() {
    if (selected_node_1 != null && selected_node_2 != null){
      $("#editLink").show();
      selected_link = getLinkFromNodes(selected_node_1,selected_node_2);
      if (selected_link!=null){
        $("#newNote").val(selected_link.description);
        $("#editLink").html("Update Link");
        $("#deleteEdge").show();
      }else{
        current_link = {source: selected_node_1, target: selected_node_2, value: 1, description: ""};
        links.push(current_link);
        $("#newNote").val("");
        $("#editLink").html("Create Link");
        $("#deleteEdge").hide();
      }
    }else{
      $("#editLink").hide();
      $("#deleteEdge").hide();
    }

    force.charge(-300).start();
    nodes = force.nodes();
    //links = force.links()
    force.links(links);
    link = link.data(links);
    var link_group = link.enter().insert("g", ".node")
        .attr("class", function(d){
          return "link "+d.value;
        })
        .style("stroke-dasharray",function(d){
          if (d.description == ""){
            return 5;
          }else {
            return 0;
          }
        })
        /*
        .attr("id", function(d){
          return d.source.name + " to " + d.target.name;
        })*/
        .on("mouseover",handleMouseOver)
        .on("mouseout",handleMouseOut)
        .on("mousedown", edge_click);
      link_group
        .append("line");
      link_group
        .append("text")
        .text(" ");

    link.exit().remove();

    node = node.data(nodes);

    var node_group = node.enter().append("g")
        .attr("class", function(d){
          return "node " + d.category + " "+d.docid;
        })
        .call(drag);
    node_group.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) {
          return d.name;
        });
    node_group.append("circle")
        .attr("r", 6)
        .on("mousedown",
          function(d) {
            // disable zoom
            vis.call(d3.behavior.zoom().on("zoom"), null);
            //open the editor panel
            $("button.edit").html("Hide Edit Panel");
            $("#edit-panel.collapse").collapse('show');

            $("p#graph-instructions").fadeOut("slow");

            if (current_link != null && current_link.description == ""){
              links.splice(links.indexOf(current_link), 1);
              current_link = null;
            }

            mousedown_node = d;
            // if (mousedown_node == selected_node_1) selected_node_1 = null;
            // else selected_node_1 = mousedown_node;

            // deselect current selections: 
            // the last two nodes clicked on are selected
            if (mousedown_node == selected_node_1){
              //deselect the current selection : selected_node_1
              selected_node_1 = selected_node_2;
              selected_node_2 = null;
              $("#node2").val("");
              selected_link = null;
              if (selected_node_1 == null){
                $("#node1").val("");
              }else{
                $("#node1").val(selected_node_1.name);
              }
              //$("#edit-panel.collapse").collapse('hide');
              //$("button.edit").html("Expand").css("visibility", "visible");
              /*
              if (selected_node_2 == null){
                selected_node_1 = null;
                $("#node1").val("");
              }else{
                selected_node_1 = selected_node_2;
                $("#node1").val(selected_node_1.name);

                selected_node_2 = null;
                $("#node2").val("");
              }
              */
            }else if (mousedown_node == selected_node_2){
              //deselect the current selection : selected_node_2
              //$("#edit-panel.collapse").collapse('hide');
              //$("button.edit").html("Expand").css("visibility", "visible");
              selected_node_2 = null;
              selected_link = null;
              $("#node2").val("");
            }
            /*else if (selected_node_1 != null) {
              //mousedown_node is a different node than selected one connect them
              var newlink = {source: selected_node_1, target: mousedown_node};

              if(contains_link(links, newlink) == -1){
                links.push(newlink); //TODO ensure that links does not contain link yet
              }

              resetMouseVars();
              selected_node_1 = null;
            }
            */
            else if(selected_node_1 == null){
              //open the editor panel
              selected_node_1 = mousedown_node;
              $("#node1").val(selected_node_1.name);
              /*
              //selected_node_1 is null, set the current selection to mousedown_node
              selected_node_1 = mousedown_node;
              //open the editor panel
              $("button.edit").html("Expand").css("visibility", "hidden");
              $("#edit-panel.collapse").collapse('show');
              //set node 1 of the editor panel to be the name of the selected node
              $("#node1").val(selected_node_1.name);
              */
            }else if(selected_node_2 == null){
              selected_node_2 = mousedown_node;
              $("#node2").val(selected_node_2.name);
            }else{
              selected_node_1 = selected_node_2;
              selected_node_2 = mousedown_node;
              $("#node1").val(selected_node_1.name);
              $("#node2").val(selected_node_2.name);
              current_link = getLinkFromNodes(selected_node_1,selected_node_2);
              if (current_link!=null){
                $("#newNote").val(current_link.description);
              }else{
                $("#newNote").val("");
              }
            }
            //selected_link = null;

            // reposition drag line
            // drag_line
            //     .attr("class", "link")
            //     .attr("x1", mousedown_node.x)
            //     .attr("y1", mousedown_node.y)
            //     .attr("x2", mousedown_node.x)
            //     .attr("y2", mousedown_node.y);
            /*
            if (selected_node_1 == null && selected_node_2 == null){
              //$("#edit-panel.collapse").collapse('hide');
              $("button.edit").html("Create New Links");
            }*/
            resetMouseVars();
            redraw();
          })
        .on("mousedrag",
          function(d) {
            // redraw();
          })
        .on("mouseup",
          function(d) {
            if (mousedown_node) {
              // mouseup_node = d;
              // if (mouseup_node == mousedown_node) { resetMouseVars(); return; }
              //
              // // add link
              // var link = {source: mousedown_node, target: mouseup_node};
              // links.push(link);
              //
              // // select new link
              // selected_link = link;
              // selected_node_1 = null;

              // enable zoom
              vis.call(d3.behavior.zoom().on("zoom"), rescale);
              redraw();
            }
          })
        /*
        .transition()
          .duration(750)
          .ease("elastic")
          .attr("r", 10)
          */;

    node.exit().transition()
        .attr("r", 0)
      .remove();
      /*
    if (d3.event) {
      // prevent browser's default behavior
      d3.event.preventDefault();
    }
    if (selected_node_1 == null || selected_node_2 == null){
      $("#createEdge").prop('disabled',true);
      $("#deleteEdge").prop('disabled',true);
      $("#editRelationship").prop('disabled',true);
    }

    if (selected_node_1 != null && selected_node_2 != null){
      //var tmplink = {source: selected_node_1, target: selected_node_2, value: 1, description:""};
      selected_link = getLinkFromNodes(selected_node_1,selected_node_2);
      if (selected_link==null){
        $("#createEdge").prop('disabled',false);
        $("#deleteEdge").prop('disabled',true);
        $("#editRelationship").prop('disabled',true);
      }else{
        $("#createEdge").prop('disabled',true);
        $("#deleteEdge").prop('disabled',false);
        $("#editRelationship").prop('disabled',false);
      }
    }*/
    node.classed("node_selected", function(d) {
      if (d === selected_node_1 || d === selected_node_2){
        return true;
      }else{
        return false;
      }
    });

    link.classed("link_selected", function(d) {
      if (d === selected_link){
        return true;
      }else{
        return false;
      }
    });

    /* instructions for graph editing
    var n1n2 = "Please click on name entities to select Dot 1";
    var s1n2 = "Dot 1 selected, please select Dot 2, or click again to deselect Dot 1";
    var s1s2 = "Ready to create or edit an edge, click again to deselect nodes or click a third node to update Dot 2";
    var n1s2 = "Dot 2 selected, please select Dot 1, or click again to deselect Dot 2";

    if (selected_node_1 == null && selected_node_2 == null){
      $("p#graph-instructions").html(n1n2);
    }else if (selected_node_1 != null && selected_node_2 == null){
      $("p#graph-instructions").html(s1n2);
    }else if (selected_node_1 != null && selected_node_2 != null){
      $("p#graph-instructions").html(s1s2);
    }else{
      $("p#graph-instructions").html(n1s2);
    }
    */}

// functions
  // allow panning if nothing is selected
  function mousedown() {
    if (!mousedown_node) { //TODO MAKE SURE YOU HAVE CLICKED_NODE SOMEWHERE TODO
      vis.call(d3.behavior.zoom().on("zoom"), rescale);
      return;
    }
  }

  function resetMouseVars() {
    mousedown_node = null;
    mouseup_node = null;
    mousedown_link = null;
  }

  function tick() {
    link.select("line")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    link.select("text")
        .attr("x", function(d) { return (d.source.x+d.target.x)/2; })
        .attr("y", function(d) { return (d.source.y+d.target.y)/2; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  }

    /*
  * returns 1 if linksArr contains this_link, otherwise, returns -1
  */
  function contains_link(linksArr, this_link)
  {
    var contains = -1;
    if (this_link == null){
      return -1;
    }
    linksArr.forEach(function(that_link) {
      if((this_link.source.name == that_link.source.name
              && this_link.target.name == that_link.target.name) || (this_link.source.name == that_link.target.name
        && this_link.target.name == that_link.source.name))
      {
        contains = 1;
      }
    })
    return contains;
  }

  function node1form_change(){
    if (current_link != null && current_link.description == ""){
      links.splice(links.indexOf(current_link), 1);
      current_link = null;
    }
    var selectedValue = d3.event.target.value;
    //TODO highlight
    if (selectedValue == ""){
      selected_node_1 = null;
      $("#editLink").hide();
      $("#deleteEdge").hide();
      redraw();
      return;
    }
    var node_from_list = get_node_from_string(selectedValue);
    if (node_from_list!=null){
      selected_node_1 = node_from_list;
      redraw();
    }
  }

  function node2form_change(){
    if (current_link != null && current_link.description == ""){
      links.splice(links.indexOf(current_link), 1);
      current_link = null;
    }
    var selectedValue = d3.event.target.value;
    if (selectedValue == ""){
      selected_node_2 = null;
      redraw();
      return;
    }
    var node_from_list = get_node_from_string(selectedValue);
    if (node_from_list!=null){
      selected_node_2 = node_from_list;
      redraw();
    }
  }

  function get_node_from_string(nodestring){
    var matching_node = null;
    nodes.forEach(function(node){
      if (node.name == nodestring){
        matching_node = node;
      }
    });
    return matching_node;
  }

  // rescale g
  function rescale() {
    //trans=d3.event.translate;
    //scale=d3.event.scale;
    trans=zoom.translate();
    scale=zoom.scale();
    vis.attr("transform",
        "translate(" + trans + ")"
        + " scale(" + scale + ")");
  }

  // action to take on mouse click of an edge
  function edge_click(d){
    $("#deleteEdge").prop('disabled',false);
    $("#editRelationship").prop('disabled',false);
    selected_node_1 = d.source;
    selected_node_2 = d.target;
    selected_link = d;
    //var edge_decription = window.prompt("How is "+source+" related to "+target+" ?", "Edge Description Here...");
    $("#node1").val(selected_node_1.name);
    $("#node2").val(selected_node_2.name);
    $("#newNote").val(d.description);

    $("button.edit").html("Hide Edit Panel");
    $("#edit-panel.collapse").collapse('show');

/*
    if (edge_decription != null){
      d3.select(this)
        .append("text")
        .attr('class','edgelabel')
        .attr("x",(this.children[0].x1.baseVal.value+this.children[0].x2.baseVal.value)/2)
        .attr("y",(this.children[0].y1.baseVal.value+this.children[0].y2.baseVal.value)/2)
        .style("stroke","black")
        .style("font-size",35)
        .text(edge_decription);
    }
    */

    /*
    if (clicked_flag == false){
      clicked_flag = true;
    }else{
      clicked_flag = false;
      d3.select(this)
        .selectAll("text").remove();
    }*/
    resetMouseVars();
    redraw();
  }


  function handleMouseOver(d){
    /* move to css
    d3.select(this).selectAll("line")
      .style("stroke-width",8)
      .style("stroke","red");
    */
    d3.select(this)
      .classed("link_hover",true)
      .selectAll("text")
      .attr("class","tmp")
      .attr("x",(this.children[0].x1.baseVal.value+this.children[0].x2.baseVal.value)/2)
      .attr("y",(this.children[0].y1.baseVal.value+this.children[0].y2.baseVal.value)/2)
      .style("stroke","black")
      .style("font-size",12)
      .text(function(d){
          return d.description;
        });
  }

  function handleMouseOut(d){
    /* move to css
    d3.select(this).selectAll("line")
      .style("stroke-width",2)
      .style("stroke","#ccc");
    */
    d3.select(this)
      .classed("link_hover",false)
      .select("text.tmp").html(" ");
  }


  function spliceLinksForNode(node) {
    toSplice = links.filter(
      function(l) {
        return (l.source === node) || (l.target === node); });
    toSplice.map(
      function(l) {
        links.splice(links.indexOf(l), 1); });
  }

/* dropped feature
  function keydown() {
    if (!selected_node_1 && !selected_link) return;
    switch (d3.event.keyCode) {
      case 8: // backspace
      case 46: { // delete
        if (selected_node_1) {
          nodes.splice(nodes.indexOf(selected_node_1), 1);
          spliceLinksForNode(selected_node_1);
        }
        else if (selected_link) {
          //TODO remove the text from the moused over link
          links.splice(links.indexOf(selected_link), 1);
          d3.selectAll("text.tmp").remove();
        }
        selected_link = null;
        selected_node_1 = null;
        redraw();
        break;
      }
    }
    
  }
*/
  function getLinkFromNodes(srcNode, tgtNode){
    var resultLink = null;
    links.forEach(function(l){
      if ((l.source.name == srcNode.name && l.target.name == tgtNode.name) || (l.source.name == tgtNode.name && l.target.name == srcNode.name)){
        resultLink = l;
        return null;
      }
    });
    return resultLink;
  }

  function text_node_select() {
    if (current_link != null && current_link.description == ""){
      links.splice(links.indexOf(current_link), 1);
      current_link = null;
    }

    // if click on selected nodes, cancel that node
    if(selected_node_1 != null && selected_node_1.name == this.innerHTML){
      selected_node_1 = null;
      $("#node1").val("");
      redraw();
      return;
    }else if(selected_node_2 != null && selected_node_2.name == this.innerHTML){
      selected_node_2 = null;
      $("#node2").val("");
      redraw();
      return;
    }

    if (selected_node_1 == null){
      selected_node_1 = get_node_from_string(this.innerHTML);
      //if a node matched the name within the 'em' tag then do the following:
        //expand the dropdown graph editor
        //set the node1 dropdown to be the option of selected_node_1.
        //redraw the graph
      if(selected_node_1 != null){
       $("button.edit").html("Hide Edit Panel");
       $("#edit-panel.collapse").collapse('show');
       $("#node1").val(selected_node_1.name);
     }
    }else if (selected_node_2 == null){
      selected_node_2 = get_node_from_string(this.innerHTML);
      //if a node matched the name within the 'em' tag then do the following:
        //expand the dropdown graph editor
        //set the node1 dropdown to be the option of selected_node_1.
        //redraw the graph
      if(selected_node_2 != null){
       $("button.edit").html("Hide Edit Panel");
       $("#edit-panel.collapse").collapse('show');
       $("#node2").val(selected_node_2.name);
     }
    }else{
      selected_node_1 = selected_node_2;
      selected_node_2 = get_node_from_string(this.innerHTML);
      //if a node matched the name within the 'em' tag then do the following:
        //expand the dropdown graph editor
        //set the node1 dropdown to be the option of selected_node_1.
        //redraw the graph
      if(selected_node_2 != null){
       $("button.edit").html("Hide Edit Panel");
       $("#edit-panel.collapse").collapse('show');
       $("#node1").val(selected_node_1.name);
       $("#node2").val(selected_node_2.name);

       current_link = getLinkFromNodes(selected_node_1,selected_node_2);
       if (current_link != null && current_link.description!=""){
        $("#newNote").val(current_link.description);
       }
      }
    }
    redraw();
  }
  function interpolateZoom (translate, scale) {
    var self = this;
    return d3.transition().duration(350).tween("zoom", function () {
        var iTranslate = d3.interpolate(zoom.translate(), translate),
            iScale = d3.interpolate(zoom.scale(), scale);
        return function (t) {
            zoom
                .scale(iScale(t))
                .translate(iTranslate(t));
            rescale();
        };
    });
  }

  function zoomClick() {
    var clicked = d3.event.target,
        direction = 1,
        factor = 0.2,
        target_zoom = 1,
        center = [width / 2, height / 2],
        extent = zoom.scaleExtent(),
        translate = zoom.translate(),
        translate0 = [],
        l = [],
        view = {x: translate[0], y: translate[1], k: zoom.scale()};

    d3.event.preventDefault();
    direction = (this.id === 'zoom_in') ? 1 : -1;
    target_zoom = zoom.scale() * (1 + factor * direction);

    if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
    view.k = target_zoom;
    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

    view.x += center[0] - l[0];
    view.y += center[1] - l[1];
    interpolateZoom([view.x, view.y], view.k);
  }

  function reset(){
    selected_node_1 = null;
    selected_node_2 = null;
    selected_link = null;
    current_link = null;
    $("#node1").val("");
    $("#node2").val("");
    $("#newNote").val("");
    $("#impSlider").val(1);
  }
  d3.selectAll('.zoom').on('click', zoomClick);
});