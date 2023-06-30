const searchForm = document.querySelector(".search-form");
const cityInput = document.querySelector(".city-input");

let map;
let service;
let infowindow;

function initMap() {
  const sydney = new google.maps.LatLng(-33.867, 151.195);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: sydney,
    zoom: 15,
  });

  // type query to change location
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const query = cityInput.value;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
        const location = results[0].geometry.location;
        const request = {
          location: location,
          radius: 5000,
          type: "tourist_attraction",
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            console.log("Query:", query); // Log the queried location
            console.log("Number of Results:", results.length);
            console.log("Tourist Attractions:");

            const attractions = [];
            const attractionsCount = Math.min(5, results.length);
            for (let i = 0; i < attractionsCount; i++) {
              const place = results[i];
              attractions.push(place.name);
              console.log(`Attraction ${i + 1}: ${place.name}`);
            }

            map.setCenter(results[0].geometry.location);
          }
        });
      }
    });
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

window.initMap = initMap;
