
var visible_nodes = [];
var visible_links = []
var data_array = [];
var filtered_data = {'nodes':[], "links":[]};

var drag_enabled = false;



$(document).ready(function() {

$.getJSON("data/hsc_d3_data_final.json", function(data){
    data_array = data
    console.log(data)
  });
  
  function load_data(){
    if (data_array.length == 0){
      console.log("Empty");
      $("#messages").text("Loading...");
      setTimeout(function(){load_data()}, 2000);
    }
    else {
      $("#messages").text("Click on a node to expand to connections");
      console.log("Full");

      setInterval(function(){
        if ($("svg").children().length === 0){
          for (nd in data_array['nodes']){
          if ( visible_nodes.indexOf(data_array['nodes'][nd]['id']) >= 0 ){
              filtered_data['nodes'].push(data_array['nodes'][nd]);
            };
        };    
          for (lk in visible_links){
            filtered_data['links'].push(visible_links[lk])
        };    

          activate(filtered_data)
        }
      }
        , 2000);
    }
  }

  
  load_data()


  $("input").on( "click", function() {
    if ($("input:checked").attr("id") === "drag_enabler"){
      drag_enabled = true;
    } else if ($("input:checked").attr("id") === "expand_enabler") {
      drag_enabled = false;
    }
  });
    
});


function activate(data_act){
  console.log(data_act)
  svg = d3.select("svg");
  width="960"
  height="780"

  // var color = d3.scaleOrdinal(d3.schemeCategory20b);
  var color = d3.scaleOrdinal().range(["#009933", "#990099"]);

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));


  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(data_act.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("g")
    .data(data_act.nodes)
    .enter().append("g")
    
  var circles = node.append("circle")
      .attr("r", 7)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )
      ;

  var lables = node.append("text")
      .text(function(d) {
        return d.label;
      })
      .attr('x', 8)
      .attr('y', 3);

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(data_act.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(data_act.links);

  node.on("click", function(clicked_node) {
    if (drag_enabled == false){
      $("#my_dataviz").empty();
      $("#my_dataviz").append("<svg width='1200' height='1200'></svg>");
      
      clicked_node_id = JSON.parse(JSON.stringify(clicked_node.id));
      
      visible_nodes.push(clicked_node_id);

      filtered_data = {'nodes':[], "links":[]};

      get_connections(clicked_node_id);

    }
    

  });

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  }
  
    
  $("button[name='submit_node']").on("click", function(){
    $("#my_dataviz").empty();
    $("#my_dataviz").append("<svg width='1200' height='1200'></svg>");
    submitted_node = $("#node_selector").val();
    visible_nodes.push(submitted_node);
    visible_nodes = unique(visible_nodes);
    console.log(visible_nodes);
    filtered_data = {'nodes':[], "links":[]};
    get_connections(submitted_node);
  });

  function get_connections(startNode){

    for (lk in data_array['links']){
      if ( startNode === data_array['links'][lk]['source']) {
        visible_links.push(data_array['links'][lk])
        visible_nodes.push(data_array['links'][lk]['target'])
    } else if ( startNode === data_array['links'][lk]['target']){

        visible_links.push(data_array['links'][lk])
        visible_nodes.push(data_array['links'][lk]['source'])
      }
    }
    visible_nodes = unique(visible_nodes)
    
  }
  
  


function dragstarted(d) {

  if (drag_enabled == true){
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
}

function dragged(d) {
    if (drag_enabled == true){
      d.fx = d3.event.x;
      d.fy = d3.event.y;  
  }
}

function dragended(d) {
    if (drag_enabled == true){
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null; 
  }
}



};






function unique(list) {
  var result = [];
  $.each(list, function(i, e) {
    if ($.inArray(e, result) == -1) result.push(e);
  });
  return result;
}