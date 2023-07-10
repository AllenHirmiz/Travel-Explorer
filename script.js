const searchForm = document.querySelector(".search-form");
const cityInput = document.getElementById("city-input");
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

const addFavourite = document.getElementById("add-favourite");
const favouritesList = document.getElementById("favourite-list");
const viewFavourite = document.getElementById("view-favourite");
const cityHeading = document.querySelector(".city-heading");
const modalHeading = document.querySelectorAll(".modal-heading");
const titleEl = document.querySelector(".title");
const clearBtn = document.getElementById("clear-all-favourites");

// variables
let map;
let service;
let infowindow;
let photo_positon = 0;
let favourite = [];
mapEl.style.display = "none";

// init map
function initMap() {
  const sydney = new google.maps.LatLng(-33.867, 151.195);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: sydney,
    zoom: 10,
  });

  // searchForm submit
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    mapEl.style.display = "flex";
    cityHeading.innerHTML =
      cityInput.value.charAt(0).toUpperCase() + cityInput.value.slice(1);

    modalHeading.forEach((modalHeading) => {
      modalHeading.innerHTML =
        cityInput.value.charAt(0).toUpperCase() + cityInput.value.slice(1);
    });

    // Get the value of the input field
    const query = cityInput.value;

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

        // nearbyPlaceSearch gets place name and other details
        service.nearbySearch(request, async (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const attractions = [];
            const attractionsCount = Math.min(5, results.length);
            photosContainer.innerHTML = "";
            card.innerHTML = "";
            for (let i = 0; i < attractionsCount; i++) {
              const place = results[i];
              attractions.push(place.name);
              createMarker(place);
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
                    
                    if (result.website){
                      var website = result.website.split("?");
                      website = website[0];
                  }
                    attractionNameEl[i].innerHTML = ` ${place.name}`;
                    searchFlickrImages(query + " " + place.name);
                    attractionAddressEl[
                      i
                    ].innerHTML = ` ${result.formatted_address}`;
                    attractionPhoneNumberEl[
                      i
                    ].innerHTML = ` ${result.formatted_phone_number}`;
                    attractionWebsiteEl[i].innerHTML = ` ${website}`;
                    attractionWebsiteEl[i].href = ` ${website}`;
                    attractionRatingEl[
                      i
                    ].innerHTML = `Rating: ${place.rating}/5`;
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
  });
}
// createMarker gets place markers on google maps
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

// searFlickrImages returns images based on query and place.name
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

// Render a new li for each favourite
function renderfavourites() {
  favouritesList.innerHTML = "";
  for (var i = 0; i < favourite.length; i++) {
    var favourites = favourite[i];
    var input = document.createElement("li");
    input.innerHTML = favourites;
    input.setAttribute("id", favourites);
    input.setAttribute("class", "list-group-item");
    input.setAttribute("onClick", "reply_click(this.id)");
    favouritesList.appendChild(input);
  }
}
// clear button
clearBtn.addEventListener("click", function () {
  favouritesList.innerHTML = "";
  favourite = [];
  localStorage.removeItem("favourite");
});
