const searchFormEl = document.querySelector(".search-form");
var repoContainerEl = document.querySelector('#flickr-photo-api');
var repoSearchTerm = document.querySelector('#result-text');
var cityInputEl = document.querySelector('#city-input');


function handleFlickrSearchUrl (event) {
  event.preventDefault();
  var cityInput = cityInputEl.value.trim();
  console.log("cityInput " + cityInput)
  if (cityInput) {
    getFlickrPhotoRepos(cityInput);
    console.log("handleFlickrSearchUrl true")
  } else {
    alert('Please enter a GitHub username');
  }
};

var getFlickrPhotoRepos = function (user) {
  var apiUrl = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=7e0eac3fe5289a602d661c8c7ec31672&text=' + user + '&sort=desc&per_page=5&page=1&format=json&nojsoncallback=1';
  console.log(apiUrl);
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data.photos.photo, user);
          console.log("getFlickrPhotoRepos True");
          console.log(apiUrl);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
};


var displayRepos = function (repos, searchTerm) {
  console.log("You are here displayRepos " + repos.length)
    if (repos.length === 0) {
    repoContainerEl.textContent = 'No repositories found.';
    return;
  } else {
    ;
  }

  repoSearchTerm.textContent = searchTerm;

  for (var i = 0; i < repos.length; i++) {
    var repoId = repos[i].id // call correct para
    var repoServerId = repos[i].server;
    var repoSecret = repos[i].secret;
    var repoFarm = repos[i].farm;
    var photoLink = "https://farm"+ repoFarm +".staticflickr.com/"+ repoServerId +"/"+ repoId +"_"+ repoSecret +".jpg"   
    
    console.log("photoLink "+ photoLink)
    console.log("Allen")

    var repoEl = document.createElement('div');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';

    var titleEl = document.createElement('img');
    titleEl.src = photoLink;

    repoContainerEl.appendChild(titleEl);
  }
};


searchFormEl.addEventListener('submit', handleFlickrSearchUrl);