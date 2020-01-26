
var initial_node = ["Isabeau"];
var data_array = [];
var filtered_data = {'nodes':[], "links":[]};

$.getJSON("data/test_data1.json", function(data){
  data_array = data
});


$(document).ready(function() {
    for (node in data_array['nodes']){
      if ( initial_node.indexOf(data_array['nodes'][node]['id']) >= 0 ){
          filtered_data['nodes'].push(data_array['nodes'][node]);
        };
    };    

  activate(filtered_data);


    
});


function activate(data_act){
svg = d3.select("svg");
width="1200"
height="1000"

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

// d3.json(data_array, function(error, graph) {

  // if (error) throw error;

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
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })
      // .call(d3.drag()
      //     .on("start", dragstarted)
      //     .on("drag", dragged)
      //     .on("end", dragended))
      ;

  var lables = node.append("text")
      .text(function(d) {
        return d.id;
      })
      .attr('x', 6)
      .attr('y', 3);

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(data_act.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(data_act.links);

  node.on("click", function(clicked_node) {
    $("#my_dataviz").empty();
    $("#my_dataviz").append("<svg width='960' height='600'></svg>");
    clicked_node_id = JSON.parse(JSON.stringify(clicked_node.id));
    filtered_data = {'nodes':[], "links":[]};

    for (lk in data_array['links']){
      
      if ( clicked_node_id.indexOf(data_array['links'][lk]['source']) >= 0 ){
        
        console.log(data_array['links'][lk])
    }
    }

    
    activate(filtered_data);

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
// });

};



function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
