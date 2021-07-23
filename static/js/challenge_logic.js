// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the second tile layer that will be the background of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create the map object with center, zoom level and default layer.
//// Instead of 'let map', we'll use 'var myMap'.
var myMap = L.map('mapid', {
	center: [40.7, -94.5],
	zoom: 3,
	layers: [streets]
});

// Create a base layer that holds all three maps.
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets
};

// 1. Add a 2nd layer group for the tectonic plate data.
let allEarthquakes = new L.LayerGroup();
//// Following 13.6.4 (2021), we'll make a new layer group called 'allTectonicPlates'.
let allTectonicPlates = new L.LayerGroup();
//// For Deliverable 2 of the Module Challenge 13 (2021), we'll add a third layer group called
//// 'majorEarthQuakes'.
let majorEarthQuakes = new L.LayerGroup();

// 2. Add a reference to the tectonic plates group to the overlays object.
let overlays = {
  "Earthquakes": allEarthquakes
};
//// Like in 13.6.4 (2021), we'll make an overlay object called 'tectonics' to 
//// reference one of our layer groups, specifically allTectonicPlates.
let tectonics = {
  "Tectonic Plates": allTectonicPlates
};
//// We'll do the same for our 'majorEarthquakes' layer group, calling the
//// overlay object 'majors'.
let majors = {
  "Major Earthquakes": majorEarthQuakes
}

// Then we add a control to the map that will allow the user to change which
// layers are visible.
L.control.layers(baseMaps, overlays).addTo(myMap);

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. We pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the magnitude of the earthquake.
  function getColor(magnitude) {
    if (magnitude > 5) {
      return "#ea2c2c";
    }
    if (magnitude > 4) {
      return "#ea822c";
    }
    if (magnitude > 3) {
      return "#ee9c00";
    }
    if (magnitude > 2) {
      return "#eecc00";
    }
    if (magnitude > 1) {
      return "#d4ee00";
    }
    return "#98ee00";
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data, {
    	// We turn each feature into a circleMarker on the map.
    	pointToLayer: function(feature, latlng) {
      		console.log(data);
      		return L.circleMarker(latlng);
        },
      // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
     // We create a popup for each circleMarker to display the magnitude and location of the earthquake
     //  after the marker has been created and styled.
     onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(allEarthquakes);

  // Then we add the earthquake layer to our map.
  allEarthquakes.addTo(myMap);

//// Deliverable 2: To retrieve JSON data of major earthquakes, we'll need d3.json(),
//// as mentioned in the Module 13 Challenge (2021) instructions.
//// For convenience, we'll store the major earthquakes URL in a variable.
let mEQ = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson'
//// For this d3 function, we'll use 'major' as our parameter for major earthquakes.
d3.json(mEQ).then(function(major) {
  //// Deliverable 2: We'll refactor the styleInfo code used in prior
  //// GeoJSON code so that the major earthquakes gets the same style.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  //// Deliverable 2: Here, we'll refactor the getColor code. This time,
  //// however, there will be 3 colors for 3 magnitudes: less than
  //// magnitude 5, greater than magnitude 5, and greater than magnitude 6
  //// ("Module 13 Challenge", 2021).
  function getColor(magnitude) {
    //// Magnitude 5- Earthquakes will be light magenta.
    if (magnitude <= 5) {
      return "#ffbbff";
    }
    //// Magnitude 5+ Earthquakes will be normal magenta.
    if (magnitude > 5) {
      return "#ff00ff";
    }
    //// Magnitude 6+ Earthquakes will be purple.
    if (magnitude > 6) {
      return "#800080";
    }
    //// The rest of the earthquakes will be
    return "#ffffff";
  }

  //// Deliverable 2: Then we'll refactor the getRadius code
  //// ("Module 13 Challenge", 2021).
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  //// Deliverable 2: Since we use 'major' as our parameter for the major  
  //// earthquakes data, we'll use 'major' here to pass the data into a 
  //// new geoJSON layer ("Module 13 Challenge", 2021).
  L.geoJson(major, {
    pointToLayer: function(feature, latlng) {
        console.log(major);
        return L.circleMarker(latlng);
      },
  //// As in the starter code, the below code gives each circleMarker
  //// the style we defined in our styleInfo function ("Module 13 Challenge", 2021).
  style: styleInfo,
   //// Per the starter code, we'll use 'bindPopup' to make popups for each circleMarker
   //// that describe each earthquake's magnitude and location ("Module 13 Challenge", 2021)
   onEachFeature: function(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  }
  //// Next, we'll add this geoJSON layer to the 'majorEarthQuakes' layer.
  }).addTo(majorEarthQuakes);
  //// Finally, we'll add the layer to 'myMap'.
  majorEarthQuakes.addTo(myMap)
});

  // Here we create a legend control object.
let legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");

  const magnitudes = [0, 1, 2, 3, 4, 5];
  const colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
  ];

// Looping through our intervals to generate a label with a colored square for each interval.
  for (var i = 0; i < magnitudes.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(myMap);


  //// 3. Use d3.json to make a call to get our Tectonic Plate geoJSON data.
  //// First, per 13.5.3 (2021), we'll define a variable that houses an external URL to the tectonic plate data. 
  //// In particular, we'll dig into the boundaries JSON file.
  let tectPlateURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
  //// In our d3.json function, we will now make a new function, with a 'tecto' parameter, that uses 
  //// Leaflet's geoJSON() function. For debugging, we'll include console.log inside the tecto function.
  d3.json(tectPlateURL).then(function(tecto) {
    console.log(tecto);
    //// Per Module 13 Challenge instructions (2021), we'll add the tecto data 
    //// to our 'allTectonicPlates' layer group
    L.geoJson(tecto).addTo(allTectonicPlates);
    //// Finally, we'll add the layer group to the map.
    allTectonicPlates.addTo(myMap)
  });
});
