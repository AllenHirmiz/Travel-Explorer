const searchForm = document.querySelector(".search-form");
const cityInput = document.querySelector(".city-input");
const photosContainer = document.getElementById("photos-container");

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

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const query = cityInput.value;
    searchFlickrImages(query);
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

const flickrAPIKey = "fe1fb057d724fc26c393238213247861";

function searchFlickrImages(query) {
  const flickrEndpoint = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrAPIKey}&format=json&nojsoncallback=1&text=${query}&per_page=6`;

  fetch(flickrEndpoint)
    .then((response) => response.json())
    .then((data) => {
      const photos = data.photos.photo;
      photosContainer.innerHTML = "";
      for (let i = 0; i < 6 && i < photos.length; i++) {
        const photo = photos[i];
        const imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
        const card = document.createElement("div");
        card.className = "card";
        const img = document.createElement("img");
        img.src = imgUrl;
        card.appendChild(img);
        const cardSection = document.createElement("div");
        cardSection.className = "card-section";
        card.appendChild(cardSection);
        photosContainer.appendChild(card);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const query = cityInput.value;
  searchFlickrImages(query);
});
