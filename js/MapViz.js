var MapViz = {

  // Data
  geoData: null,
  crimeData: null,

  // Config
  mapselector: ".map",
  legendselector: ".maplegend",

  // Interaction

  // D3 Components
  colorScale: null,
  features: null,
  svg: null,
  legendsvg:null,
  zoom: null,
  projection: null,
  width: null,
  height: null,
  legendwidth:null,
  legendheight:null,

  // Stadium elements
  stadium: null,
  stadium_x: null, 
  stadium_y: null,
  stadium_width: 20, 
  stadium_height: 30,

  // Crime elements
  crimes: null,
  crime_r:2,
  crimeColorScheme:null,


  draw: function(geoData, crimeData) {
    // Save Data
    this.geoData = geoData;
    this.crimeData = crimeData;

    // Set Dimensions. 
    var width = 700,
        height = 800; 
        this.width = 800;
        this.height = 600;

    // Adjust Map Projection 
    var projection = d3.geo.mercator()
        // .scale(92249.50798338694)
        // .center([-122.33600017610198,47.61497543359545]) //projection center-122.3320313,47.59514
        .scale(770000)
        .center([-122.3320313,47.59514]) //projection center
        .translate([width/2,height/2]) //translate to center the map in vie
    this.projection = projection;
    //Generate paths based on projection
    var path = d3.geo.path()
        .projection(this.projection);

    // Destroy The Old One, create new one
    d3.select(this.mapselector).selectAll("svg").remove();
    this.svg = null;

    //Create an SVG
    var svg = d3.select(this.mapselector).append("svg")
      .attr("width", width)
      .attr("height", height);
    this.svg = svg;


    //Group for the map features
    features = svg.append("g")
        .attr("class","features");
    this.features = features;
    // console.log(this.features);

    // Bind data to features
    features.selectAll("path")
      .data(topojson.feature(this.geoData,this.geoData.objects.neighborhoods).features) //generate features from TopoJSON
      .enter()
      .append("path")
      .attr("d",path)
      .on("click",this.clicked);

   // Display Stadium
    var stadium_coords = projection([-122.3320313,47.59514]);
    var stadium_x = stadium_coords[0];
    this.stadium_x = stadium_x;
    var stadium_y = stadium_coords[1];
    this.stadium_y = stadium_y;
    var stadium_width= 20; 
    this.stadium_width = stadium_width;
    var stadium_height = 30;
    this.stadium_height = stadium_height;
    var stadium = svg.append("g")
      .append("rect")
      .style("fill", "green")
      .attr("width", stadium_width)
      .attr("height",stadium_height)
      .attr("x", stadium_x - stadium_width)
      .attr("y", stadium_y - stadium_height);
    this.stadium = stadium;

    //Create zoom/pan listener
    //Change [1,Infinity] to adjust the min/max zoom scale
    var zoom = d3.behavior.zoom()
        .scaleExtent([1, Infinity])
        .on("zoom",this.zoomed);
    this.zoom = zoom;
    svg.call(zoom); //make map zoomable.

    this.createCrimeColorScheme();
    this.displayCrimes();

    this.displayLegend();

    //tooltip
     $('svg circle').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
          var d = this.__data__;
          return 'Crime type: '+ d.event_clearance_subgroup
          + '<br> Description: '+ d.event_clearance_description  
          + '<br> Date: '+ getNiceDate(d.event_clearance_date);
        }
      });
  },

  // Add optional onClick events for features here
  // d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
  clicked: function(d,i) {
  },

  displayCrimes: function(){
    var crime_r = 5;

    var crimes = this.svg.append("g")
      .attr("class", "crimes");

    crimes.selectAll("circle")
          .data(this.crimeData)
          .enter()
          .append("circle")
          .attr("cx", function(d,i) {
            return MapViz.projection([d.longitude,d.latitude])[0];
          })
          .attr("cy", function(d,i) {
            return MapViz.projection([d.longitude,d.latitude])[1];

          })
          .attr("r", crime_r)
          .style("fill",this.colorCrime);
    // To use elsewhere. 
    this.crimes = crimes; 
    this.crime_r = crime_r;

  },

  zoomed: function(){

    MapViz.features
        .attr("transform", "translate(" + MapViz.zoom.translate() + ")scale(" + MapViz.zoom.scale() + ")")
        .selectAll("path").style("stroke-width", 1 / MapViz.zoom.scale() + "px" );
    MapViz.stadium
        .attr("transform", "translate(" + MapViz.zoom.translate() + ")scale(" + MapViz.zoom.scale() + ")")
        .selectAll("rect")
        .attr("x", MapViz.stadium_x/MapViz.zoom.scale())
        .attr("y", MapViz.stadium_y/MapViz.zoom.scale())
        .attr("height", MapViz.stadium_height/MapViz.zoom.scale())
        .attr("width", MapViz.stadium_width/MapViz.zoom.scale());

    MapViz.crimes
      .attr("transform", "translate(" + MapViz.zoom.translate() + ")scale(" + MapViz.zoom.scale() + ")")
      .selectAll("circle").attr("r", MapViz.crime_r/MapViz.zoom.scale() );

  },

  createCrimeColorScheme: function() {
    crimeList =  "RECKLESS BURNING;NOISE DISTURBANCE;HARBOR CALLS;ANIMAL COMPLAINTS;ASSAULTS;AUTO RECOVERIES;AUTO THEFTS;BURGLARY ALARMS (FALSE);CAR PROWL;CASUALTIES;COMMERCIAL BURGLARIES;DISTURBANCES;FRAUD CALLS;GUN CALLS;HAZARDS;LIQUOR VIOLATIONS;MENTAL CALL;MISCELLANEOUS MISDEMEANORS;NARCOTICS COMPLAINTS;NUISANCE, MISCHIEF COMPLAINTS;PANIC ALARMS (FALSE);PARKING VIOLATIONS;PARKS EXCLUSIONS;PERSONS - LOST, FOUND, MISSING;PROPERTY - MISSING, FOUND;PROPERTY DAMAGE;PROWLER;RESIDENTIAL BURGLARIES;ROBBERY;SEX OFFENSE (NO RAPE);SUSPICIOUS CIRCUMSTANCES;THEFT;THREATS, HARASSMENT;TRAFFIC RELATED CALLS;TRESPASS;VEHICLE ALARMS (FALSE);VICE CALLS;WARRANT CALLS;WEAPONS CALLS";
    crimeArray = crimeList.split(';');
    // this.crimeData
    // for 
    var crimeColorScheme = {}; 
    for (var i = crimeArray.length - 1; i >= 0; i--) {
      crimeColorScheme[crimeArray[i]] = this.getRandomColor();
    };

    this.crimeColorScheme = crimeColorScheme; 
  },

  colorCrime: function(d,i){

       if (d.event_clearance_subgroup in MapViz.crimeColorScheme) {
          return MapViz.crimeColorScheme[d.event_clearance_subgroup];
       } else {
          console.log(d.event_clearance_subgroup);
          console.log('crime type not found in colorscheme');
          return "black";
      }

  },

  getRandomColor: function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },

  displayLegend: function() {

    // Set Dimensions. 
    var legendwidth = 200,
        legendheight = 600; 
        this.legendwidth = legendwidth;
        this.legendheight = legendheight;

    var legendsvg = d3.select(MapViz.legendselector).append("svg")
      .attr("width", legendwidth)
      .attr("height",legendheight);
    this.legendsvg = legendsvg;

    var items = legendsvg.append("g")
                .attr("class", "legend-items");

        // items.selectAll("text")
        //   .data(MapViz.crimeColorScheme)
        //   .enter()
        //   .append("text")
        //   .attr("x"
        //   .attr("name", function(d) {return d});


        // items.selectAll("circle")
        //   .data(MapViz.crimeColorScheme)
        //   .enter()
        //   .append("circle")
        //   .attr
        //   .attr("fill", function (d) {

        //   }

  }


}

function getNiceDate(date) {
  var parse = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
  date = parse(date);
  foo = d3.time.format("%d %b %Y");
  foo(date)
  return foo(date)
}