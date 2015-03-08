// console.log("hello!");

// // Century Field Location:  47.59514,-122.3320313 

// //Canvas settings
// var width = 800;
// var height = 500;

// // Place holders
// var svg = "";
// var map = ""; // map data 

// // Map Settings
// var center = ""; // need data for this to compute;
// var scale = 1220;
// var offset = [width/2,height/2];
// var projection = d3.geo.mercator()
//       .scale(scale)
//       // .translate(offset)
// var path = d3.geo.path().projection(projection);
// var bounds;
// var neighborhoods;
// var streets;




// // d3.json("geojson/saa.json", function(data) {
// d3.json("seattle-atlas/geo/seattle.json", function(data) {
//   map = data; 
//   console.log(map);

//   neighborhoods = topojson.feature(map, map.objects.neighborhoods);
//   var neighborhood = neighborhoods.features[0]

//   svg = d3.select(".mapd3").append("svg")
//     .attr("width", width)
//     .attr("height", height);

//   // Map settings
//   // center = d3.geo.centroid(map);
//   bounds = path.bounds(neighborhood);
//   // scale = .95 / Math.max((bounds[1][0] - bounds[0][0]) / width, (bounds[1][1] - bounds[0][1]) / height);
//   // offset = [(width - scale * (bounds[1][0] + bounds[0][0])) / 2, (height - scale * (bounds[1][1] + bounds[0][1])) / 2];

//   // projection
//   //   .translate(offset)
//   //   .scale(scale)


//   // projection.center([47.59514,-122.3320313]);

//   console.log("hello");

//   svg.append("path")
//     .datum(neighborhoods)
//     .attr("d", path);

//   // put stadium in
//   svg.append("g")
//     .append("circle")
//     .style("fill", "blue")
//     .style("stroke", "blue")
//     .attr("r", 10)
//     .attr("cx", 100)
//     .attr("cy", 100);



// });





