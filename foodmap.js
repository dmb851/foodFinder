var map;
var service;

function initialize() {
    getLocation();
}

var x = document.getElementById("title");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

  var mylocation = new google.maps.LatLng(latitude,longitude);

  map = new google.maps.Map(document.getElementById('map'), {
      center: mylocation,
      zoom: 13
    });

  var request = {
    location: mylocation,
    radius: '1000',
    query: 'restaurant'
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, placescallback);

}


function placescallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        createMarker(place, map);
        console.log(place);  
      }
    }
}


//Connects to places api and creates markers and detail info window and places buttons
function createMarker(place, map) {
  var infowindow = new google.maps.InfoWindow();
  const newrequest = {
      placeId: place.place_id,
      fields: ["name", "formatted_address", "place_id", "geometry","website","opening_hours","formatted_phone_number","business_status"],
    };
  const newservice = new google.maps.places.PlacesService(map);
  

    const bounds = new google.maps.LatLngBounds();
    const placesList = document.getElementById("places");
  
    const image = {
        url: "http://maps.google.com/mapfiles/ms/micons/restaurant.png",
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
    };

    const marker =new google.maps.Marker({
        map,
        icon: image,
        title: place.name,
        position: place.geometry.location,
    });

    

    marker.addListener("click", () => {
      map.setZoom(17);
      map.setCenter(marker.getPosition());

      newservice.getDetails(newrequest, (newplace, newstatus) => {
        if (newstatus === google.maps.places.PlacesServiceStatus.OK) {
          google.maps.event.addListener(marker, "click", function () {
            infowindow.setContent(
              "<div><strong>" +
                newplace.name +
                "</strong><br><br>" +
                "Business Status: " +
                newplace.business_status +
                "<br>" +
                "<br>" +
                newplace.formatted_address +
                "</div><br>"+
                "Opening Hours: " +
                newplace.opening_hours.weekday_text +
                "<br>" +
                "<br>" +
                "Phone: " +
                newplace.formatted_phone_number +
                "<br>"+
                "<br>" +
                "<a href =" +newplace.website +" >Check Us Out Online</a>"+
                "<br>" 
            );
    
            infowindow.open(map, this);
          });
        }
      });

    });

    //Places Buttons
    const placesbutton = document.createElement("button");
    placesbutton.textContent = place.name;
    placesbutton.setAttribute("class", "m-1 btn btn-warning");
    placesbutton.onclick = function(){
      map.setZoom(17);
      map.setCenter(marker.getPosition());
      infowindowpopup(newservice, newrequest, infowindow, map, marker);
     
    };
    placesList.appendChild(placesbutton);
    bounds.extend(place.geometry.location);

}
       

function infowindowpopup(newservice, newrequest, infowindow, map, marker){
  newservice.getDetails(newrequest, (newplace, newstatus) => {
    if (newstatus === google.maps.places.PlacesServiceStatus.OK) {
        infowindow.setContent(
          "<div><strong>" +
            newplace.name +
            "</strong><br><br>" +
            "Business Status: " +
            newplace.business_status +
            "<br>" +
            "<br>" +
            newplace.formatted_address +
            "</div><br>"+
            "Opening Hours: " +
            newplace.opening_hours.weekday_text +
            "<br>" +
            "<br>" +
            "Phone: " +
            newplace.formatted_phone_number +
            "<br>"+
            "<br>" +
            "<a href =" +newplace.website +" >Check Us Out Online</a>"+
            "<br>" 
        );
        infowindow.open(map, marker);
    }
  });
}