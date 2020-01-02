    var all_nodes; 
    var all_links;
    
    $.getJSON("data/test_data.json", function(json){
/*    $.getJSON("data/hsc_d3_data.json", function(json){*/
        all_links = json['links'];
        all_nodes = json['nodes'];
        console.log(all_nodes,all_links)
    });
    
/*    This should be chosen by the user*/
    var initial_node = "2";
    
$(document).ready(function() {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;
    color = d3.scaleOrdinal(d3.schemeCategory10);
   
   var svg = d3.select("#my_dataviz").append("svg")
    .attr("width", width)
    .attr("height", height);
    
    var nodes = [],
        links = []
        visible_nodes = [initial_node] /* List of the nodes that are already in the canvas, so to not add them twice */

/*        This should be important to check that the data loads before starting*/
/*    var loading = setInterval(function(){
       if (typeof all_links === 'undefined') {
            console.log("Not Loaded")
            $("#my_dataviz").text("Loading");
        } else {
            
            console.log("loaded", nodes);
            restart();
            loaded();
        };    
    }, 500);
    
    function loaded(){
        clearInterval(loading)
    };*/

    
/*    nodes = all_nodes.filter(function(node){return node['id'] === initial_node});*/
    var nodes = [{id:"2",Name:"B"}]
    var links = []
    
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
/*    Adapt this function with the external data*/
        var filtered_links = all_links.filter(function(lk){
            return lk['source'] === String(clicked_node['id']) || lk['target'] === String(clicked_node['id'])
        });
        
        console.log(filtered_links)
        
        var filtered_nodes_ids = new Set([]);
           for (lk in filtered_links){
               filtered_nodes_ids.add(filtered_links[lk]['source']);
               filtered_nodes_ids.add(filtered_links[lk]['target']);
            };
         filtered_nodes_ids = Array.from(filtered_nodes_ids)
         
         filtered_nodes_ids = jQuery.grep(filtered_nodes_ids, function(node_id){
             return jQuery.inArray(node_id,visible_nodes) === -1;
         })
                  
         filtered_nodes = all_nodes.filter(function(nd){
               return filtered_nodes_ids.includes(nd['id']);
            });
         
         for (nd in filtered_nodes){
             nodes.push(filtered_nodes[nd]);
         };
                
        
        /*for (lk in filtered_links){
              links.push(filtered_links[lk])    
          };
        */
        
        
        
        
 /*       if (toggle_master === 0 ){
            nodes = [a,b];
            toggle_master = 1;
        } else if (toggle_master === 1 ){
            links.push({source: 2, target: 3});
            links.push({source: 1, target: 2}); 
            nodes.push(a);
            nodes.push(b);
            nodes.push(c);
            toggle_master = 2;
        } else if (toggle_master === 2) {
            nodes.pop(); // Remove c.
            links.pop(); // Remove c-a.
            links.pop(); // Remove b-c.
            toggle_master = 1;
        };*/
        
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