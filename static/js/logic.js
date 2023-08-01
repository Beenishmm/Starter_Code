// Wait for the document to be ready
document.addEventListener('DOMContentLoaded', function () {
    // Create the map and set the initial view to a specific location
    var tectonicPlates = new L.LayerGroup()
    const map = L.map('map',{
      //layers: [tectonicPlates]
    }).setView([0, 0], 2);
    // Add the base layer (you can choose other tile layers if you prefer)
    // let streetview = 
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(map);

    // let topo = 
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    // let overLays = {
    //   "Earthquakes": earthquakes,
    //   "Plates": tectonicPlates
    // }
    // let basemaps = {
    //   "Street": streetview,
    //   "Topographical": topo
    // }


    // L.control(basemaps, overLays).addTo(map);
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(data){
      L.geoJSON(data).addTo(tectonicPlates);
      tectonicPlates.addTo(map);
  
    });
    // Function to set the size of the marker based on magnitude
    function getMarkerSize(magnitude) {
      return magnitude * 4;
    }
  
    // Function to set the color of the marker based on depth
    function getMarkerColor(depth) {
      if (depth < 10) {
        return '#00FF00'; // Green for shallow earthquakes
      } else if (depth < 50) {
        return '#FFD700'; // Gold for moderate depth earthquakes
      } else {
        return '#FF0000'; // Red for deep earthquakes
      }
    }
  
    // Function to create the custom marker with pop-up information
    function createCustomMarker(feature, latlng) {
      const markerOptions = {
        radius: getMarkerSize(feature.properties.mag),
        fillColor: getMarkerColor(feature.geometry.coordinates[2]),
        color: '#000',
        weight: 1,
        opacity: 0.7,
        fillOpacity: 0.8,
        className: 'awesome-marker',
        icon: 'star' // You can use other icons here. Check the documentation.
      };
      return L.circleMarker(latlng, markerOptions);
    }
  
    // URL of the GeoJSON data
    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
  
    // Fetch the data and add it to the map
    fetch(url)
      .then(response => response.json())
      .then(data => {
        L.geoJSON(data, {
          pointToLayer: createCustomMarker,
          onEachFeature: function (feature, layer) {
            layer.bindPopup(
              `<strong>Location:</strong> ${feature.properties.place}<br>
              <strong>Magnitude:</strong> ${feature.properties.mag}<br>
              <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`
            );
          }
        }).addTo(map);
      });
  
    // Create a legend to provide context for the map data
    const legend = L.control({ position: 'bottomright' });
  
    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      const depths = [-10, 10, 50];
      const labels = ['Shallow', 'Moderate Depth', 'Deep'];
  
      for (let i = 0; i < depths.length; i++) {
        div.innerHTML += '<i style="background:' + getMarkerColor(depths[i] + 1) + '"></i> ' + labels[i] + '<br>';
      }
      return div;
    };
  
    legend.addTo(map);
  });
  