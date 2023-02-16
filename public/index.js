   
const xhr = new XMLHttpRequest();
const xhr2 = new XMLHttpRequest();
var checkins_all;
var events_all;
   
function load1_checkins(){
  xhr2.open("GET", "./checkins");
  xhr2.onload = function() {
    if (xhr2.status === 200) {
      const response = JSON.parse(xhr2.responseText);
      //const venues = response.response.venues;
      console.log(response);
      checkins_all = response;
      load2_events();
    } else {
      console.error(xhr2.statusText);
    }
  };
  
  xhr2.onerror = function() {
    console.error(xhr2.statusText);
  };
  
  xhr2.send();
}
load1_checkins()

function load2_events(){
  xhr.open("GET", "./getbars");
   
  xhr.onload = function() {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      //const venues = response.response.venues;
      //console.log(response);
      events_all = response
      dropMarkers(response);
    } else {
      console.error(xhr.statusText);
    }
  };
  
  xhr.onerror = function() {
    console.error(xhr.statusText);
  };
  
  xhr.send();
}

var markers = [];
function dropMarkers(response){
//console.log(response.results)
  response.results.forEach((element) => {
      //console.log(element.geocodes.main);
      //console.log(element.geocodes.main.latitude);
      //console.log(element.geocodes.main.longitude);
      //console.log(element.name);
      var event_checkins = [];
      for(x=0; x<checkins_all.length; x++){
        if(checkins_all[x].event == element.name){
          event_checkins.push(checkins_all[x]);
          console.log(event_checkins)
        }  
      }
     
      if(event_checkins.length > 0){
        var marker1 = new mapboxgl.Marker()
        .setLngLat([element.geocodes.main.longitude, element.geocodes.main.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML('<h2>'+element.name+'</h2> <br> <p>'+element.location.formatted_address+'<p/> <p> Checkin count is: '+ JSON.stringify(event_checkins.length) +'</p>'))
        //.setHTML('<h2>'+element.name+'</h2><p>'+ JSON.stringify(event_checkins) +' is checked-in</p>'))
        .addTo(map);
        markers.push(marker1);
      }else{
        var marker1 = new mapboxgl.Marker()
        .setLngLat([element.geocodes.main.longitude, element.geocodes.main.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML('<h2>'+element.name+'</h2><p> No checkins available.</p>'))
        .addTo(map);
        markers.push(marker1);
      }
  });

  map.on('moveend', function (e) {
    var bounds = map.getBounds();
      // Loop through the markers
      markers.forEach(function(marker) {
      // Check if the marker is within the bounds
      if (bounds.contains([marker._lngLat['lng'], marker._lngLat['lat']])) {
        // Add the marker to the list of markers within bounds
        //markersInBounds.push(marker);
        //console.log(marker)
        console.log(map.getZoom())

        if(map.getZoom() > 12){
          marker.togglePopup();
        }
      }
    });
  });

}





  