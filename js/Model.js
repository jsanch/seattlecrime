var Model = {
    geoData:null,
    crimeData:null,

    minDate:null, 
    maxDate:null,
    startdate:null,
    enddate:null,

    initData: function(callback,startdate,enddate) {

       Model.geoData = null;
       Model.crimeData = null; 
       Model.startdate = startdate;
       Model.enddate = enddate;

        var checkMultiLoad = function() {
            if (Model.geoData != null && Model.crimeData != null)  {
                callback.call(window, Model.geoData, Model.crimeData);
            }
        }
        
        Model.loadCrimeData(startdate,enddate,function(result) {
            Model.crimeData = result;
            checkMultiLoad();

            });

        Model.loadGeoData(function(result){
            Model.geoData = result;
            checkMultiLoad();
        });

    },

    loadCrimeData: function (startdate,enddate,successCallback) {
        console.log("loading crime data");

          var formater = d3.time.format("%Y-%m-%d");
          var s = formater(startdate);
          var e = formater(enddate);
          console.log(s);
          console.log(e);
          // s='2013-07-01'
          // e='2013-07-31'

          // build url
          sodaurl= "https://data.seattle.gov/resource/3k2p-39jp.json?$where=within_circle(incident_location,47.59514,-122.3320313,1609.34) AND (event_clearance_date >= "+"'"+s+"'"+" AND event_clearance_date < "+"'"+e+"'"+")&$limit=10000"
          console.log(sodaurl);

        $.ajax({
            type: "GET",
            url: sodaurl ,
            // url: 'data/temp.json',
            dataType: 'json',
            error: Model.dataLoadError,
            success: successCallback
        })
    },



    loadGeoData: function (successCallback) {
        console.log("loading geo data");
        $.ajax({
            type: "GET",
            url: "geojson/seattle.topojson",
            dataType: 'json',
            error: Model.dataLoadError,
            success: successCallback
        })
    },

    dataLoadError: function(xhr, ajaxOptions, thrownError) {
        console.log(xhr, ajaxOptions, thrownError);
        alert('Could not load data from file.')
    }




}

