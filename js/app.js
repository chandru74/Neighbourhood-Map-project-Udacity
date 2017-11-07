
//initializing map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: { lat: 13.3172775, lng: 75.7138884}
  });
  largeInfowindow = new google.maps.InfoWindow();
  bounds = new google.maps.LatLngBounds();
  service = new google.maps.places.PlacesService(map);
  populateMarker(locations);
  map.fitBounds(bounds);
}
//generate markers to show on map
function populateMarker(locations) {
  for (var i = 0; i < locations.length; i++) {
    var marker = new google.maps.Marker({
      position: locations[i].position,
      animation: google.maps.Animation.DROP,
      title: locations[i].title,
      placeId: locations[i].placeId,
      map: map
    });
    markers.push(marker);
    bounds.extend(locations[i].position);
    bindEvent(marker);

  }
}

function bindEvent(marker) {
  marker.addListener('click', function() {
    getDetails(marker);
  });
}
//display all markers
function showAllMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setVisible(true);
  }
}
//display specific marker
function showMarker(place) {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].placeId == place.placeId) {
      markers[i].setVisible(true);
    }
  }
}
//remove all markers
function removeMarker(place) {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].placeId == place.placeId) {
      markers[i].setVisible(false);
    }
  }
}

function setTimer(marker){
  setTimeout(function() {
    marker.setAnimation(null);
  }, 1400);
}

//display the data passed to this function at a given marker in a infowindow
function populateInfoWindow(name, description, rating, contact, image, marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent(
      '<div>' + "Name : " + name + '</div>' + 
       '<div>' + "Website : " + '<a href=>' + website + '</a>' + '</div>' +
      '<div>' + "Rating : " + rating + '</div>' + 
      '<div>' + "Phone No : " +contact + '</div>' + 
      '<img src=' + image + ' alt=' + name + '>'
      );
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}

// obtain details from the google places api and wiki api
function getDetails(location) {
  var marker;
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].placeId == location.placeId) {
      marker = markers[i];break;
    }
  }
  if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        //the animation stops after 2 seconds
        setTimer(marker);
      }
      map.setZoom(12);
      //sets the marker position to center when the marker is clicked
      map.setCenter(marker.getPosition());
      service.getDetails({ placeId: marker.placeId }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
         var name = place.name;
         var description = place.types[0];
         //obtain description of the place using wiki api
        
          image = place.photos[0].getUrl({
            'maxWidth': 150,
            'maxHeight': 150
          });
          if (place.website !== undefined) {
            website = place.website;
          } else {
            website = "Not Mentioned ";
          }

          if (place.rating !== undefined) {
            rating = place.rating;
          } else {
            rating = "Not Mentioned ";
          }
          if (place.international_phone_number !== undefined) {
            contact = place.international_phone_number;
          } else {
            contact = "Not Mentioned ";
          }
        } else {
          errorMessage("could not fetch data from googlePlace service");
        }
        populateInfoWindow(place.name, website, rating, contact, image, marker, largeInfowindow);

        $.ajax({
         url: "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.title + "&format=json&limit=1&callback=wikiCallback",
         timeout : 5000,
         dataType: "jsonp",
              success: function(data) {
                place_description(data[2]);
              },
              error: function(jqXHR, exception){
                //an error pops out if fail to get data from wiki API within 5seconds
                alert(  "error occured!! Unable to load wiki API");
              }
            });
        });
    }

function googleError(){
  errorMessage("Unable to load google maps.Try again later");
}



//view model
var ViewModel = function() {
  searchQuery = ko.observable();
  place_description = ko.observable();
  apiError = ko.observable(false);
  errorMessage = ko.observable();
  searchResult = ko.computed(function() {
     query = searchQuery();
    if (!query) {
      showAllMarker();
      return locations;
    } else {
      return ko.utils.arrayFilter(locations, function(place) {
        if (place.title.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        return place;
        } 
        removeMarker(place);
      });
    } 
  });

};
//apply binding to the observales
ko.applyBindings(new ViewModel());
