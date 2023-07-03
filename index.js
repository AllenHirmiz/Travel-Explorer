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
<<<<<<< Updated upstream
var submitFavouriteButton = document.getElementById('add-favourite');
=======
const openModalButton = document.getElementById("openModalButton");
const modal = document.querySelector("#modal");
const closeModalButton = modal.querySelector(".close");
const cityName = document.getElementById("city-name");
const addToFavoritesButton = document.getElementById("add-to-favorites");
const favoritesModal = document.getElementById("favorites-modal");
const viewFavoritesButton = document.getElementById("view-favorites");
const favoritesList = document.getElementById("favorites-list");
const clearFavoritesButton = document.getElementById("clear-favorites");
const openFavoritesButton = document.getElementById("openFavoritesButton");
const closeFavoritesButton = document.getElementById("closeFavoritesButton");
const favoriteButtons = document.querySelectorAll(".favorite-button");
>>>>>>> Stashed changes

let map;
let service;
let infowindow;

var photo_positon = 0;

submitFavouriteButton.addEventListener('click', addFavourite);

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

          const imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;

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

<<<<<<< Updated upstream


function addFavourite(event) {
  event.preventDefault();
  var initials = initialsInput.value.trim();
  if (initials !== '') {
    var Favourite = {
      initials: initials,
      score: score
    };
    Favourites.push(Favourite);
    Favourites.sort(function (a, b) {
      return b.score - a.score;
    });
    saveFavourites();
    viewFavourites();
  }
}
=======
// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();
  const cityInput = document.querySelector(".city-input");
  const cityName = cityInput.value;
  document.querySelector("#city-name").textContent = cityName;
  cityInput.value = ""; // Clear the input field
}

// Add event listener to the form
const form = document.querySelector(".search-form");
form.addEventListener("submit", handleSubmit);

// Function to add an attraction to the favorites list in local storage
function addToFavorites(attractionName) {
  // Get the existing favorites from local storage or initialize an empty array
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Check if the attraction is already in favorites
  const existingIndex = favorites.findIndex((item) => item === attractionName);
  if (existingIndex === -1) {
    // If not already in favorites, add it
    favorites.push(attractionName);

    // Update the local storage with the updated favorites array
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Display a confirmation message to the user in a modal
    const modalContent = document.querySelector("#modal .modal-content");
    modalContent.innerHTML = `
      <span class="close">&times;</span>
      <h2>Added to Favorites!</h2>
      <button id="view-favorites">View Favorites</button>
    `;
    const modal = document.getElementById("modal");
    modal.style.display = "block";

    // Add click event listener to "View Favorites" button in the modal
    const viewFavoritesButton = modal.querySelector("#view-favorites");
    viewFavoritesButton.addEventListener("click", () => {
      modal.style.display = "none"; // Hide the current modal
      favoritesModal.style.display = "block"; // Show the favorites modal
      displayFavorites(); // Display the favorited locations
    });
  } else {
    // If already in favorites, display a message to the user
    alert(`${attractionName} is already in favorites!`);
  }
}

// Function to display the favorited locations in the favorites modal
function displayFavorites() {
  favoritesList.innerHTML = ""; // Clear the existing list

  // Get the favorites from local storage
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    // If no favorites, display a message
    favoritesList.innerHTML = "<p>No favorites added.</p>";
  } else {
    // Create a list item for each favorite and append it to the favorites list
    favorites.forEach((favorite) => {
      const li = document.createElement("li");
      li.textContent = favorite;
      favoritesList.appendChild(li);
    });
  }
}

// Function to clear the favorites from local storage
function clearFavorites() {
  localStorage.removeItem("favorites");
  favoritesList.innerHTML = "<p>No favorites added.</p>";
}

// Open the favorites modal when the button is clicked
openFavoritesButton.addEventListener("click", () => {
  favoritesModal.style.display = "block";
  displayFavorites();
});

// Close the favorites modal when the close button is clicked
closeFavoritesButton.addEventListener("click", () => {
  favoritesModal.style.display = "none";
});

// Close the favorites modal when the user clicks outside of it
window.addEventListener("click", (event) => {
  if (event.target === favoritesModal) {
    favoritesModal.style.display = "none";
  }
});

// Clear favorites button click event
clearFavoritesButton.addEventListener("click", clearFavorites);

// Add click event listeners to each favorite button
favoriteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const attractionName = button.previousElementSibling.textContent;
    addToFavorites(attractionName);
  });
});
>>>>>>> Stashed changes
