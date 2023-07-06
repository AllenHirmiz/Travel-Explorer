const searchForm = document.querySelector(".search-form");
const searchButton = document.getElementById("search");
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
const mainContainerEl = document.getElementById("mainContainer");
const mapEl = document.getElementById("map");

var addFavourite = document.getElementById("add-favourite");
var favouritesList = document.getElementById("favourite-list");
var viewFavourite = document.getElementById("view-favourite");
const cityHeading = document.getElementById("city-heading");
const modalHeading = document.getElementById("modal-heading");
const titleEl = document.getElementById("title");

let map;
let service;
let infowindow;

var photo_positon = 0;
var favourite = [];

function initMap() {
  const sydney = new google.maps.LatLng(-33.867, 151.195);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: sydney,
    zoom: 10,
  });

  searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    cityHeading.innerHTML = cityInput.value;
    modalHeading.innerHTML = cityInput.value;
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
              console.log(place.name);
              attractions.push(place.name);
              createMarker(place);
              console.log("Before :" + place.name);
              // console.log(query + " " + place.name);

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


                    var website = result.website.split("?");
                    website = website[0];

                    
                    attractionNameEl[i].innerHTML = ` ${place.name}`;
                    searchFlickrImages(query + " " + place.name);

                    attractionNameEl[i].innerHTML = ` ${
                      place.name
                    }`;
                    attractionAddressEl[
                      i
                    ].innerHTML = ` ${result.formatted_address}`;
                    attractionPhoneNumberEl[
                      i
                    ].innerHTML = ` ${result.formatted_phone_number}`;
                    attractionWebsiteEl[
                      i
                    ].innerHTML = ` ${website}`;
                    attractionWebsiteEl[i].href = website;
                    attractionRatingEl[i].innerHTML = `Rating: ${place.rating}/5`;
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
    mainContainerEl.classList.remove("hide");
    mapEl.classList.remove("hide");
    addFavourite.classList.remove("hide");
    titleEl.classList.remove("page-center");
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
  const flickrEndpoint = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrAPIKey}&radius=1&format=json&nojsoncallback=1&text=${query}&per_page=5`;

  fetch(flickrEndpoint)
    .then((response) => response.json())
    .then((data) => {
      if (
        data &&
        data.photos &&
        data.photos.photo &&
        data.photos.photo.length > 0
      ) {
        const photos = data.photos.photo;
        photosContainer.innerHTML = "";
        const photo = photos[0];
        if (photo && photo.server && photo.id && photo.secret) {
          const imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
          const img = document.createElement("img");
          img.className = "photo-size";
          img.src = imgUrl;
          card.appendChild(img);
          const cardSection = document.createElement("div");
          card.appendChild(cardSection);
          photosContainer.appendChild(card);
        }
      } else {
        console.log("no photo data on Flickr");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function storeFavourite() {
  // Stringify and set key in localStorage to Favourite array
  localStorage.setItem("favourite", JSON.stringify(favourite));
}

// Add submit event to form
addFavourite.addEventListener("click", function (event) {
  event.preventDefault();

  var favouriteText = cityInput.value.trim();

  // Return from function early if submitted Favourite is blank
  if (favouriteText === "") {
    return;
  }

  // Add new FavouriteText to Favourite array, clear the input
  favourite.push(favouriteText);
  cityInput.value = "";

  // Store updated Favourite in localStorage, re-render the list
  storeFavourite();

  console.log(localStorage);
});

viewFavourite.addEventListener("click", function (event) {
  event.preventDefault();
  var storedFavourite = JSON.parse(localStorage.getItem("favourite"));

  // If Favourite were retrieved from localStorage, update the Favourite array to it
  if (storedFavourite !== null) {
    favourite = storedFavourite;
  }
  renderfavourites();
});

function renderfavourites() {
  favouritesList.innerHTML = "";

  // Render a new li for each favourite
  for (var i = 0; i < favourite.length; i++) {
    var favourites = favourite[i];
    console.log(favourites);
    var input = document.createElement("li");
    input.innerHTML = favourites;
    input.setAttribute("id", favourites);
    input.setAttribute("class", "list-group-item");
    input.setAttribute("onClick", "reply_click(this.id)");
    favouritesList.appendChild(input);
  }
}
