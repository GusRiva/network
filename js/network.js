function filterLinks(node, all_links){
    var filtered_links = all_links.filter(function(link){
            return link['source']['id'] == 2 || link['target']['id'] == 2;
        });
   return filtered_links;
};





$(document).ready(function() {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
   
   var svg = d3.select("#my_dataviz").append("svg")
    .attr("width", width)
    .attr("height", height);
   
   var force = d3.layout.force()
    .gravity(.05)
    .distance(100)
    .charge(-100)
    .size([width, height]);
    

    
    d3.json("data/test_data.json", function(json) {
        force
            .nodes(json.nodes)
            .links(json.links)
            .start();
        
        
/*        Filter the nodes in the data*/
        var filtered_nodes = json.nodes.filter(function(node){
            return node['id'] == 2;
        });
        
              
        var node = svg.selectAll(".node")
            /*.data(filtered_nodes)*/
            .data(json.nodes)
          .enter().append("g") /* Enter only the selected element*/
            .attr("class", "node")
            .call(force.drag)
            
          node.append("circle")
            .attr("r","5");
      
        node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) { return d.name });
      
      
        filtered_links = [] /*  Change to json.links for all links      */
        var link = svg.selectAll(".link")
      /*      .data(filtered_links)*/
            .data(json.links)
          .enter().append("line")
            .attr("class", "link")
          .style("stroke-width", function(d) { return Math.sqrt(d.weight); });
        
      
      
      
      
        force.on("tick", function() {
          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });
      
          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
       });
       
       
       
       node.on("click", function(clicked_node) { /*Click Function*/
                filtered_links= filterLinks(clicked_node,json.links);
                connected_nodes_ids = new Set([]);
                for (lk in filtered_links){
                    connected_nodes_ids.add(filtered_links[lk]['source']['id']);
                    connected_nodes_ids.add(filtered_links[lk]['target']['id']);
                };
                                
               connected_nodes_ids = Array.from(connected_nodes_ids)
               
               /*        Filter the nodes in the data*/
                filtered_nodes = json.nodes.filter(function(node){
                    console.log(connected_nodes_ids,node['id'] )
                    return connected_nodes_ids.includes(node['id']);
                });
                console.log(filtered_nodes)
               
               var node = svg.selectAll(".node")
                   .data(filtered_nodes)
                    .enter().append("g") /* Enter only the selected element*/
                    .attr("class", "node")
                    .call(force.drag)
            
                node.append("circle")
                    .attr("r","5");
      
                node.append("text")
                    .attr("dx", 12)
                    .attr("dy", ".35em")
                    .text(function(d) { return d.name });
                                
                var link = svg.selectAll(".link")
                    .data(filtered_links)
                    .enter().append("line")
                    .attr("class", "link")
                    .style("stroke-width", function(d) { return Math.sqrt(d.weight); });
                    link.attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });
                
            });
  });
  
});