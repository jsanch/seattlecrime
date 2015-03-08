console.log("hello");
//Map dimensions (in pixels)
var width = 600,
    height = 700;

//Map projection
var projection = d3.geo.mercator()
    // .scale(92249.50798338694)
    // .center([-122.33600017610198,47.61497543359545]) //projection center
    .scale(860000)
    .center([-122.33600017610198,47.59900543359545]) //projection center
    .translate([width/2,height/2]) //translate to center the map in view

//Generate paths based on projection
var path = d3.geo.path()
    .projection(projection);

//Create an SVG
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//Group for the map features
var features = svg.append("g")
    .attr("class","features");

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.behavior.zoom()
    .scaleExtent([1, Infinity])
    .on("zoom",zoomed);

// svg.call(zoom);



 // Display Stadium
  var stadium_coords = projection([-122.3320313,47.59514]);
  var stadium_x = stadium_coords[0];
  var stadium_y = stadium_coords[1];
  var stadium_width= 20; 
  var stadium_height = 30;
  var stadium = svg.append("g")
    .append("rect")
    .style("fill", "green")
    .attr("width", stadium_width)
    .attr("height",stadium_height)
    .attr("x", stadium_x - stadium_width)
    .attr("y", stadium_y - stadium_height);

    

d3.json("geojson/seattle.topojson",function(error,geodata) {
  if (error) return console.log(error); //unknown error, check the console
  //Create a path for each map feature in the data
  features.selectAll("path")
    .data(topojson.feature(geodata,geodata.objects.neighborhoods).features) //generate features from TopoJSON
    .enter()
    .append("path")
    .attr("d",path)
    .on("click",clicked);


 

});

// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked(d,i) {

}


//Update map on zoom/pan
function zoomed() {
  features
      .attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
  // stadium
  //     .attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
  //     .selectAll("circle").attr("r", 1/zoom.scale() );
}

console.log("hello");

