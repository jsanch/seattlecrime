var Controller = {


	init: function() {
		// Today 

		var enddate = new Date(); 
		var startdate = new Date(); 
			startdate = new Date(startdate.setDate(startdate.getDate()-120));
		console.log(enddate);
		console.log(startdate);
	

		Model.initData(function(geoData,crimeData) {

			// Create the Chord Viz Here
			MapViz.draw(geoData, crimeData);

			MultiView.init(crimeData,startdate,enddate);

			this.initSlider(startdate,enddate);

		},startdate,enddate)

	},

	initSlider: function(startdate,enddate) {
		$("#slider").dateRangeSlider({
		    bounds: {
		        min: new Date(2009, 6, 17), //earliest in db
		        max: new Date() // today
		    },
		    defaultValues: {
		        min: startdate,
		        max: enddate
		    }
		});
	}



}

Controller.init();