
Certainly! Here's the updated JavaScript code:

javascript
Copy code
function searchAttractions() {
  var city = document.getElementById("cityInput").value;

  // Generate a unique callback function name
  var callbackName = "jsonpCallback_" + Date.now();

  // Create a script element
  var script = document.createElement("script");

  // Define the callback function that will handle the response
  window[callbackName] = function(data) {
    if (data.status === "OK") {
      var attractions = data.results;
      displayAttractions(attractions);
    } else {
      console.error("Error: " + data.status);
    }

    // Clean up the script tag and callback function
    document.body.removeChild(script);
    delete window[callbackName];
  };

  // Set the source URL with the query parameters and callback function name
  script.src =
    "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" +
    city +
    " attractions&key=AIzaSyAadcyTg2d2ZA-jt8Voo69vMSsuRF27A-I&callback=" + callbackName;

  // Append the script element to the HTML document
  document.body.appendChild(script);
}

function displayAttractions(attractions) {
  var attractionsList = document.getElementById("attractionsList");
  attractionsList.innerHTML = "";

  attractions.slice(0, 5).forEach(function(attraction) {
    var li = document.createElement("li");
    li.textContent = attraction.name;
    attractionsList.appendChild(li);
  });
}