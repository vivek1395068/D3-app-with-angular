import { Component,OnInit } from '@angular/core';
import * as d3 from "d3";
import {shareGraphData} from './services/shareGraphData.service'

@Component({
  selector: 'middlePanel',
  template:`<div id="middlePanel" class="middlePanel">
            </div>`,
  //templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class MiddlePanelComponent implements OnInit {
  constructor(private dataService:shareGraphData){
    dataService.fetchGraphData({id:null},this.graphGenerator.bind(this));
  }
  //alert("HK");
  ngOnInit(){
    this.dataService.updateFunction(this.graphGenerator.bind(this));
  }
  graphGenerator(){
      var graph=this.dataService.graphData;
      d3.select("svg").remove();
      //var svg = d3.select("svg"),
      var svg = d3.select("#middlePanel")
                        .append("svg")
                        .attr("width", "100%")
                        .attr("height", "600px"),
      //width = +svg.attr("width"),
      //height = +svg.attr("height");
      width=400,
      height=400;
  
      var color = d3.scaleOrdinal(d3.schemeCategory20);
  
      var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().id(function(d) { return d.id; }))
          .force("charge", d3.forceManyBody())
          .force("center", d3.forceCenter(width / 2, height / 2))
          .force("x", d3.forceX(width / 2))
          .force("y", d3.forceY(height / 2))
  
        var link = svg.append("g")
            .attr("class", "links")
          .selectAll("line")
          .data(graph.links)
          .enter().append("line")
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
  
        var node = svg.append("g")
            .attr("class", "nodes")
          .selectAll("circle")
          .data(graph.nodes)
          .enter().append("circle")
            .attr("r", (d)=>{
              if(d.soi){
                return 16
              }else{
                return 4
              }
            })
            .attr("fill", function(d) { return color(d.group); })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
  
        node.append("title")
            .text(function(d) { return d.id; });
  
        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);
  
        simulation.force("link")
            .links(graph.links);
  
        function ticked() {
          link
              .attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });
  
          node
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });
        }
  
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
  }
  
}
