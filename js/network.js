
var initial_node = 2

function filterLinks(node, all_links){
    var filtered_links = all_links.filter(function(link){
            return link['source'] == node['id'] || link['target'] == node['id'];
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
        
/*        force
            .nodes(json.nodes)
            .links(json.links)
            .start();*/
          /*        Filter the nodes in the data*/
        console.log(json)
        var filtered_nodes = json.nodes.filter(function(node){
            return node['id'] == initial_node;
        });
        
        filtered_nodes = json.nodes
        filtered_links = json.links /*  Change to json.links for all links      */
        
        
        
          force
            .nodes(filtered_nodes)
            .links(filtered_links)
            .start();

        
        
        link = svg.selectAll(".link")
/*            .data(json.links)*/
            .data(filtered_links)
          .enter().append("line")
            .attr("class", "link")
          .style("stroke-width", function(d) { return Math.sqrt(d.weight); });    

        
              
        node = svg.selectAll(".node")
/*            .data(json.nodes)*/
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
      
      
        
      
      
        force.on("tick", function() {    
/*            draw_nodes_links(node, link);*/
          link.attr("x1", function(d) { return d.source.x; }) /* Link position*/
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });
      
            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; }); /* Node position*/
       });
       
       
       node.on("click", function(clicked_node) {
            filtered_links= filterLinks(clicked_node,json.links);
                
            connected_nodes_ids = new Set([]);
            for (lk in filtered_links){
               connected_nodes_ids.add(filtered_links[lk]['source']);
               connected_nodes_ids.add(filtered_links[lk]['target']);
            };
                                
            connected_nodes_ids = Array.from(connected_nodes_ids)
               
            filtered_nodes = json.nodes.filter(function(node){
               return connected_nodes_ids.includes(node['id']);
            });
            
            node.data(filtered_nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(force.drag)
       });
       
       
    /*   node.on("click", function(clicked_node) { /\*Click Function*\/
                filtered_links= filterLinks(clicked_node,json.links);
                
                connected_nodes_ids = new Set([]);
                for (lk in filtered_links){
                    connected_nodes_ids.add(filtered_links[lk]['source']);
                    connected_nodes_ids.add(filtered_links[lk]['target']);
                };
                                
               connected_nodes_ids = Array.from(connected_nodes_ids)
               
               /\*        Filter the nodes in the data*\/
                filtered_nodes = json.nodes.filter(function(node){
                    return connected_nodes_ids.includes(node['id']);
                });
          
            
            
          
             force
                .nodes(filtered_nodes)
                .links(filtered_links)
                .start();
                
               
               var node = svg.selectAll(".node")
                   .data(filtered_nodes)
                    .enter().append("g") /\* Enter only the selected element*\/
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
                        
                   node.attr("transform", function(d) { console.log(d.x,d.y); return "translate(" + d.x + "," + d.y + ")"; }); /\* Node position*\/
                
            });*/
  });
  
});