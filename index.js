const cityInput = document.querySelector(".city-input");
const cityName = document.getElementById("city-name");
const addToFavoriteBtn = document.querySelector(".add-to-favorite");
const selectFromFavoritesBtn = document.querySelector(".select-from-favorites");
const errorHandler = document.querySelector(".error-handler");
const modal = document.getElementById("modal");
const closeModal = document.getElementsByClassName("close")[0];
const viewFavoritesBtn = document.getElementById("view-favorites");
const favoritesModal = document.getElementById("favorites-modal");
const favoritesList = document.getElementById("favorites-list");
const clearFavoritesBtn = document.getElementById("clear-favorites");
const searchForm = document.getElementById("search-form");
const photosContainer = document.getElementById("photos-container");
const attractionNameEl = document.getElementsByClassName("attractions-name");
const attractionAddressEl = document.getElementsByClassName(
  "attractions-address"
);
const attractionPhoneNumberEl = document.getElementsByClassName(
  "attractions-phone-number"
);
const attractionWebsiteEl = document.getElementsByClassName(
  "attractions-website"
);
const attractionRatingEl =
  document.getElementsByClassName("attractions-rating");

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

  searchForm?.addEventListener("submit", function (event) {
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
                    searchFlickrImages(query + " " + place.name);
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
          const photos = data.photos.photo;
          photosContainer.innerHTML = "";
          console.log(query);
          const photo = photos[0];
          // photo_positon++;

          const imgUrl = `https://live.staticflickr.com/${photo?.server}/${photo?.id}_${photo?.secret}.jpg`;

          const img = document.createElement("img");
          img.src = imgUrl;
          card.appendChild(img);
          const cardSection = document.createElement("div");
          cardSection.className = "card-section";
          card.appendChild(cardSection);
          photosContainer.appendChild(card);

          img_return(img);
        }
        // }
      )
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}

// Handle form submission
function handleSubmit(event) {
  event.preventDefault();
  const cityNameValue = cityInput.value.trim();
  if (cityNameValue) {
    getCityInfo(cityNameValue);
    cityInput.value = "";
    errorHandler.textContent = "";
  } else {
    errorHandler.textContent = "Please enter a city name";
  }
}

// Get city information
function getCityInfo(city) {
  // Simulate API call and update city name
  setTimeout(() => {
    cityName.textContent = city;
  }, 1000);
}

// Handle "Add to Favorite" button click
function handleAddToFavorite() {
  const isCityAdded = addFavorite(cityName.innerText);
  if (isCityAdded) {
    modal.style.display = "block";
  }
}

// Handle "Select From Favorites" button click
function handleSelectFromFavorites() {
  handleViewFavorites();
  favoritesModal.style.display = "block";
}

// Handle closing of the modal
function handleCloseModal() {
  modal.style.display = "none";
  favoritesModal.style.display = "none";
}

// Handle "View Favorites" button click
function handleViewFavorites() {
  modal.style.display = "none";
  favoritesModal.style.display = "block";
  // Retrieve favorites from local storage and populate the list
  const favorites = getFavoritesFromStorage();
  favoritesList.innerHTML = "";
  favorites.forEach((favorite) => {
    const li = document.createElement("li");
    li.textContent = favorite;
    favoritesList.appendChild(li);
  });
}

// Handle click events inside the favorites modal
function handleFavoritesModalClick(event) {
  if (event.target === favoritesModal) {
    favoritesModal.style.display = "none";
  }
}

// Handle "Clear Favorites" button click
function handleClearFavorites() {
  localStorage.removeItem("favorites");
  favoritesList.innerHTML = "";
}

// Retrieve favorites from local storage
function getFavoritesFromStorage() {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
}

// Handle submission of the favorite form
function submitFavouriteButton(event) {
  event.preventDefault();
  const favoriteInput = event.target.parentElement.children[0];
  const favoriteValue = favoriteInput.innerText.trim();
  if (favoriteValue) {
    const isCityAdded = addFavorite(favoriteValue);
    if (isCityAdded) {
      modal.style.display = "block";
    }
  }
}

// Add a favorite to local storage
function addFavorite(favorite) {
  const favorites = getFavoritesFromStorage();
  if (favorites.includes(favorite)) return false;
  favorites.push(favorite);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  return true;
}

// render heading once search something in the search bar
function changeSearch(event) {
  cityName.innerText = event.target.value.trim();
}
