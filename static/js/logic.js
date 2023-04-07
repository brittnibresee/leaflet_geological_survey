// Earthquake URL for all earthquakes in the last month
const DATA_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(DATA_URL).then(function(data){
    let earth_map = L.map("map", {
      center: [38.89511, -100.03637],
      zoom: 5
    });

    console.log(data);

    // Add layer to map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(earth_map);

    // Map features
    data.features.forEach(function(feature) {
        var coords = feature.geometry.coordinates;
        var mag = feature.properties.mag;
        var depth = coords[2];
        var location = feature.properties.place;
        var color = depth > 90 ? "#800026" :
                    depth > 70 ? "#BD0026" :
                    depth > 50 ? "#E31A1C" :
                    depth > 30 ? "#FC4E2A" :
                    depth > 10 ? "#FD8D3C" :
                                "#FEB24C";
        var radius = mag * 5;
        var marker = L.circleMarker([coords[1], coords[0]], {
            radius: radius,
            fillColor: color,
            fillOpacity: 0.7,
            color: "green",
            weight: 0.5
        });
        marker.bindPopup("<h3>Magnitude: " + mag + "</h3><h3>Depth: " + 
        depth + "</h3>" + "<h3>Location: " + location + "</h3>").addTo(earth_map);

    });

    // Add legend to map
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];

        // Look through and generate label
        for(var i =0; i < depths.length; i++) {
            div.innerHTML +=
            '<div style="background-color:' 
            + getColor(depths[i] + 1) + '">' +depths[i] + (depths[i + 1] ? '&ndash;' 
            + depths[i + 1] + '<br>' : '+') + '</div>';
        }

        return div;
    };

    legend.addTo(earth_map);
    plate_json = null
    plate_URL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"
    d3.json(plate_URL).then(function(data){
        L.geoJson(data, {
            color: "red",
            weight: 2,
        }).addTo(earth_map);
        });
});
  
// Function to get color based on depth
//function getColor(d) {
    //return d > 90 ? "#800026" :
           //d > 70 ? "#BD0026" :
           //d > 50 ? "#E31A1C" :
           //d > 30 ? "#FC4E2A" :
           //d > 10 ? "#FD8D3C" :
                    //"#FEB24C";
//}


