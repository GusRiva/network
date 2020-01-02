    var all_nodes; 
    var all_links;
    
    $.getJSON("data/test_data.json", function(json){
        all_nodes = json['nodes'];
        all_links = json['links'];
    });
    
/*    This should be chosen by the user*/
    var initial_node = 2;
    
    var a = {id: "a"},
        b = {id: "b"},
        c = {id: "c"},
        nodes = [{"id":2, "name":"B"}],
        links = [];
        
    


$(document).ready(function() {
    if (all_nodes.length > 1) {
        console.log("Loaded",all_nodes)
    };
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;
    color = d3.scaleOrdinal(d3.schemeCategory10);
   
   var svg = d3.select("#my_dataviz").append("svg")
    .attr("width", width)
    .attr("height", height);

    
    var simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("link", d3.forceLink(links).distance(200))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .alphaTarget(1)
        .on("tick", ticked);
    
    var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
        link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link"),
        node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");
    
    restart();
    
    toggle_master = 1;
    node.on("click", function(clicked_node) {
        if (toggle_master === 0 ){
            nodes = [a,b];
            toggle_master = 1;
        } else if (toggle_master === 1 ){
            links.push({source: a, target: b}); // Add a-b.
            links.push({source: b, target: c}); // Add b-c.
            links.push({source: c, target: a}); // Add c-a.
            nodes.push(c); // Re-add c.
            toggle_master = 2;
        } else if (toggle_master === 2) {
            nodes.pop(); // Remove c.
            links.pop(); // Remove c-a.
            links.pop(); // Remove b-c.
            toggle_master = 1;
        };
        restart();
    });



function restart() {
  // Apply the general update pattern to the nodes.
  node = node.data(nodes, function(d) { return d.id;});
  node.exit().remove();
  node = node.enter().append("circle").attr("fill", function(d) { return color(d.id); }).attr("r", 8).merge(node)
             .call(d3.drag().on("drag", dragged));

  // Apply the general update pattern to the links.
  link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
  link.exit().remove();
  link = link.enter().append("line").merge(link);

  // Update and restart the simulation.
  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(1).restart();
}

function ticked() {
  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
}

function dragged(d) {
    d.x = d3.event.x, d.y = d3.event.y;
    d3.select(this).attr("cx", d.x).attr("cy", d.y);
    link.filter(function(l) { return l.source === d; }).attr("x1", d.x).attr("y1", d.y);
    link.filter(function(l) { return l.target === d; }).attr("x2", d.x).attr("y2", d.y);
  }

});