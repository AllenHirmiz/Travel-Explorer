const searchForm = document.querySelector(".search-form");
const cityInput = document.querySelector(".city-input");
const errorHandler = document.querySelector(".error-handler");
const attractionNameEl = document.querySelectorAll(".attractions-name");
const attractionPhoneNumberEl = document.querySelectorAll(
  ".attractions-phone-number"
);
const attractionAddressEl = document.querySelectorAll(".attractions-address");
const attractionWebsiteEl = document.querySelectorAll(".attractions-website");
const attractionRatingEl = document.querySelectorAll(".attractions-rating");
const photosContainer = document.getElementById("photos-container");

let map;
let service;
let infowindow;

var photo_positon = 0;

function initMap() {
  const sydney = new google.maps.LatLng(-33.867, 151.195);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: sydney,
    zoom: 10,
  });

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const query = cityInput.value; // Get the value of the input field
    // geocoder gets attractions from query
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
        const location = results[0].geometry.location;
        const request = {
          location: location,
          radius: 5000,
          type: "tourist_attraction",
          fields: ["name", "rating", "user_ratings_total", "place_id"],
        };
        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, async (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            // console.log("Query:", query); // Log the queried location
            // console.log("Number of Results:", results.length);
            // console.log("Tourist Attractions:");

            const attractions = [];
            const attractionsCount = Math.min(5, results.length);
            photosContainer.innerHTML = "";
            card.innerHTML = "";
            for (let i = 0; i < attractionsCount; i++) {
              const place = results[i];
              attractions.push(place.name);
              createMarker(place);
              console.log("Before :" + place.name);
              // console.log(query + " " + place.name);

              const img = await searchFlickrImages(query + " " + place.name);
              card.appendChild(img);
              const cardSection = document.createElement("div");
              cardSection.className = "card-section";
              card.appendChild(cardSection);
              photosContainer.appendChild(card);
              console.log("After: " + place.name);

              service.getDetails(
                {
                  placeId: place.place_id,
                  fields: [
                    "name",
                    "formatted_address",
                    "rating",
                    "user_ratings_total",
                    "formatted_phone_number",
                    "website",
                  ],
                },
                (result, status) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK) {
                    errorHandler.innerHTML = "";
                    // console.log(`Attraction ${i + 1}: ${place.name}`);
                    // display attraction results
                    attractionNameEl[i].innerHTML = `Attraction ${i + 1}: ${
                      place.name
                    }`;
                    attractionAddressEl[
                      i
                    ].innerHTML = `Address: ${result.formatted_address}`;
                    attractionPhoneNumberEl[
                      i
                    ].innerHTML = `Phone Number: ${result.formatted_phone_number}`;
                    attractionWebsiteEl[
                      i
                    ].innerHTML = `Website: ${result.website}`;
                    attractionRatingEl[i].innerHTML = `Rating: ${place.rating}`;
                  }
                }
              );
            }
            map.setCenter(results[0].geometry.location);
          }
        });
      } else {
        errorHandler.innerHTML = "No attraction data found";
        return;
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
const card = document.createElement("div");
card.className = "card";

const flickrAPIKey = "fe1fb057d724fc26c393238213247861";

function searchFlickrImages(query) {
  return new Promise((img_return) => {
    const flickrEndpoint = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrAPIKey}&radius=1&format=json&nojsoncallback=1&text=${query}&per_page=5`;

    fetch(flickrEndpoint)
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            !data ||
            !data.photos ||
            !data.photos.photo ||
            data.photos.photo.length === 0
          ) {
            photosContainer.textContent = "no photos found";
            console.log("no photos found");
            return;
          }
          const photos = data.photos.photo;
          photosContainer.innerHTML = "";
          console.log(query);
          const photo = photos[0];
          // photo_positon++;

          const imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;

          const img = document.createElement("img");
          img.src = imgUrl;

          img_return(img);
        }
        // }
      )
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}
