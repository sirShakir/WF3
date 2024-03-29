   
const xhr = new XMLHttpRequest();
const xhr2 = new XMLHttpRequest();
const xhr3 = new XMLHttpRequest();
const xhr4 = new XMLHttpRequest();

var checkins_all;
var events_all;
   
function load1_checkins(){
  xhr2.open("GET", "./checkins");
  xhr2.onload = function() {
    if (xhr2.status === 200) {
      const response = JSON.parse(xhr2.responseText);
      //const venues = response.response.venues;
      //console.log(response);
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
      dropMarkers();
    } else {
      console.error(xhr.statusText);
    }
  };
  
  xhr.onerror = function() {
    console.error(xhr.statusText);
  };
  
  xhr.send();
}
 
// This implements `StyleImageInterface`
// to draw a pulsing dot icon on the map.

var markers = [];
function dropMarkers(){
//console.log(response.results)

  events_all.results.forEach((element) => {
        //console.log(element.geocodes.main);
        //console.log(element.geocodes.main.latitude);
        //console.log(element.geocodes.main.longitude);
        //console.log(element.name);
        var event_checkins = [];
        for(x=0; x<checkins_all.length; x++){
          if(checkins_all[x].event == element.name){
            
            event_checkins.push(checkins_all[x]);
            //console.log(event_checkins)
          }  
        }
        var encodedName =  element.name.replace(/'/g, '');
        var lat1 = element.geocodes.main.latitude;
        var lon1 = element.geocodes.main.longitude;
        let package = [encodedName,lat1,lon1]
        var html = '<button onclick="checkInVendor(\'' + package.toString ( ) + '\')" type="button" class="btn btn-success">Checkin</button>';
        if(event_checkins.length > 0){
          var marker1 = new mapboxgl.Marker()
          .setLngLat([element.geocodes.main.longitude, element.geocodes.main.latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML('<h2>'+element.name+'</h2> <br> <p>'+element.location.formatted_address+'<p/> <p> Checkin count is: '+ JSON.stringify(event_checkins.length) +`</p><br>` + html))
          //.setHTML('<h2>'+element.name+'</h2><p>'+ JSON.stringify(event_checkins) +' is checked-in</p>'))
          .addTo(map);
          markers.push(marker1);
          element.marker = marker1



        }else{
          var marker1 = new mapboxgl.Marker()
          .setLngLat([element.geocodes.main.longitude, element.geocodes.main.latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML('<h2>'+element.name+'</h2><p> No checkins available.</p><br>' + html))
          .addTo(map);
          markers.push(marker1);
          element.marker = marker1
        }
        //console.log(events_all)
  });
  build_addSources_addLayer()
}
let featureArray = [];

// for(var z=0; z<events_all.results.length; z++){
//   if(!events_all.results[z].geocodes){
//     console.log(events_all.results[z])
//   }
// }

const sizeS = 200;
const sizeM = 655;
const sizeB = 1000;
var pulsingLayers = []
function build_addSources_addLayer(){
  //console.log(events_all.results.length)
  const pulsingDotSmall = {
    width: sizeS,
    height: sizeS,
    data: new Uint8Array(sizeS * sizeS * 4),
     
    // When the layer is added to the map,
    // get the rendering context for the map canvas.
    onAdd: function () {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext('2d');
    },
     
    // Call once before every frame where the icon will be used.
    render: function () {
    const duration = 1000;
    const t = (performance.now() % duration) / duration;
     
    const radius = (sizeS / 2) * 0.3;
    const outerRadius = (sizeS / 2) * 0.7 * t + radius;
    const context = this.context;
     
    // Draw the outer circle.
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(
    this.width / 2,
    this.height / 2,
    outerRadius,
    0,
    Math.PI * 2
    );
    context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
    context.fill();
     
    // Draw the inner circle.
    context.beginPath();
    context.arc(
    this.width / 2,
    this.height / 2,
    radius,
    0,
    Math.PI * 2
    );
    context.fillStyle = 'rgba(255, 100, 100, 1)';
    context.strokeStyle = 'white';
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();
     
    // Update this image's data with data from the canvas.
    this.data = context.getImageData(
    0,
    0,
    this.width,
    this.height
    ).data;
     
    // Continuously repaint the map, resulting
    // in the smooth animation of the dot.
    map.triggerRepaint();
     
    // Return `true` to let the map know that the image was updated.
    return true;
    }
  };
  const pulsingDotMid = {
    width: sizeM,
    height: sizeM,
    data: new Uint8Array(sizeM * sizeM * 4),
     
    // When the layer is added to the map,
    // get the rendering context for the map canvas.
    onAdd: function () {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext('2d');
    },
     
    // Call once before every frame where the icon will be used.
    render: function () {
    const duration = 1000;
    const t = (performance.now() % duration) / duration;
     
    const radius = (sizeM / 2) * 0.3;
    const outerRadius = (sizeM / 2) * 0.7 * t + radius;
    const context = this.context;
     
    // Draw the outer circle.
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(
    this.width / 2,
    this.height / 2,
    outerRadius,
    0,
    Math.PI * 2
    );
    context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
    context.fill();
     
    // Draw the inner circle.
    context.beginPath();
    context.arc(
    this.width / 2,
    this.height / 2,
    radius,
    0,
    Math.PI * 2
    );
    context.fillStyle = 'rgba(255, 100, 100, 1)';
    context.strokeStyle = 'white';
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();
     
    // Update this image's data with data from the canvas.
    this.data = context.getImageData(
    0,
    0,
    this.width,
    this.height
    ).data;
     
    // Continuously repaint the map, resulting
    // in the smooth animation of the dot.
    map.triggerRepaint();
     
    // Return `true` to let the map know that the image was updated.
    return true;
    }
  };
  const pulsingDotBig = {
    width: sizeB,
    height: sizeB,
    data: new Uint8Array(sizeB * sizeB * 4),
     
    // When the layer is added to the map,
    // get the rendering context for the map canvas.
    onAdd: function () {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext('2d');
    },
     
    // Call once before every frame where the icon will be used.
    render: function () {
    const duration = 1000;
    const t = (performance.now() % duration) / duration;
     
    const radius = (sizeB / 2) * 0.3;
    const outerRadius = (sizeB / 2) * 0.7 * t + radius;
    const context = this.context;
     
    // Draw the outer circle.
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(
    this.width / 2,
    this.height / 2,
    outerRadius,
    0,
    Math.PI * 2
    );
    context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
    context.fill();
     
    // Draw the inner circle.
    context.beginPath();
    context.arc(
    this.width / 2,
    this.height / 2,
    radius,
    0,
    Math.PI * 2
    );
    context.fillStyle = 'rgba(255, 100, 100, 1)';
    context.strokeStyle = 'white';
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();
     
    // Update this image's data with data from the canvas.
    this.data = context.getImageData(
    0,
    0,
    this.width,
    this.height
    ).data;
     
    // Continuously repaint the map, resulting
    // in the smooth animation of the dot.
    map.triggerRepaint();
     
    // Return `true` to let the map know that the image was updated.
    return true;
    }
  };
  map.addImage('pulsing-s', pulsingDotSmall, { pixelRatio: 2 });
  map.addImage('pulsing-m', pulsingDotMid, { pixelRatio: 2 });
  map.addImage('pulsing-b', pulsingDotBig, { pixelRatio: 2 });


  for(var x=0; x<events_all.results.length; x++){
      //console.log(events_all.results[x])
      let checkin_event_count = 0;
      for(let y=0; y<checkins_all.length; y++){
        if(checkins_all[y].event == events_all.results[x].name){
          checkin_event_count++;
        }
      }
      if(checkin_event_count > 0){
        featureArray.push({
          'type': 'Feature',
          'geometry': {
              'type': 'Point',
              'coordinates': [events_all.results[x].geocodes.main.longitude, events_all.results[x].geocodes.main.latitude] // icon position [lng, lat]
            }
        })   
      }
  }//end of for


  const dataSource = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: featureArray
    }
  };
  map.addSource('my-source', dataSource);

  // console.log(featureArray);
  // map.addSource('dot-point', {
  //   'type': 'geojson',
  //   'data': {
  //       'type': 'FeatureCollection',
  //       'features': featureArray
  //   }
  // });

  //loop to add.map.layer
  for(var x=0; x<events_all.results.length; x++){ 

    let checkin_event_count = 0;
    for(let y=0; y<checkins_all.length; y++){
      if(checkins_all[y].event == events_all.results[x].name){
        checkin_event_count++;
      }
    }

    let circle_to_use = "";
    if(checkin_event_count == 0){
      
    }
    else if(checkin_event_count == 1){
      circle_to_use = "pulsing-s"
    }
    else if(checkin_event_count == 2){
      circle_to_use = "pulsing-m"
    }
    else if(checkin_event_count >= 3){
      circle_to_use = "pulsing-b"
    }

    if(checkin_event_count > 0){
      console.log(events_all.results[x].name);
      console.log(checkin_event_count);
      console.log(circle_to_use);
        map.addLayer({
            'id': 'layer-with-pulsing-dot' + events_all.results[x].fsq_id,
            'type': 'symbol',
            'source': 'my-source',
            "layout": {
              "icon-image": circle_to_use
          }
        });
    }


   }//end of for


}


map.on('moveend', function (e) {
  var bounds = map.getBounds();
    // Loop through the markers
    markers.forEach(function(marker) {
    // Check if the marker is within the bounds
    if (bounds.contains([marker._lngLat['lng'], marker._lngLat['lat']])) {
      // Add the marker to the list of markers within bounds
      //markersInBounds.push(marker);
      //console.log(marker)
      //console.log(map.getZoom())

      if(map.getZoom() > 15){
        marker.togglePopup();
      }
    }
  });
});


function search_bar_events(){
  let searchInputValue = document.getElementById("searchInputValue").value;
  //console.log(searchInputValue)
  //console.log(events_all.results[0].name)
  let temp_events = [];
  for(let x=0; x<events_all.results.length; x++){
    let isPushed = false;
    //console.log(events_all[x])
    if( events_all.results[x].name.toLowerCase().includes(searchInputValue.toLowerCase()) ){
      temp_events.push(events_all.results[x]);
      isPushed = true;
    }

    if(isPushed == false){
      for(let v=0; v< events_all.results[x].categories.length; v++){
        if( events_all.results[x].categories[v].name.toLowerCase().includes(searchInputValue.toLowerCase()) && isPushed == false){
          temp_events.push(events_all.results[x]);
          isPushed = true;
        }
      }//end of second for loop
    }


  }//end of outer for loop
  //console.log(temp_events)
  //div_event_stacks = temp_events;
  build_search_event_div(temp_events)

}//end of function

let profile_toggle = false;
function toggleProfileView(){
  if(profile_toggle == false){
    document.getElementById("profileBar").style.display = "inline-block" 
    profile_toggle = true
  }else{
    document.getElementById("profileBar").style.display = "none" 
    profile_toggle = false;
  }
}

var user;
function getUserDeatails(){
  xhr3.open("GET", "./user");
   xhr3.onload = function() {
    if (xhr3.status === 200) {
      const response = JSON.parse(xhr3.responseText);
      //console.log(response);  
      user = response;
      document.getElementById("profileBar").innerHTML += `<br>Username: `+JSON.stringify(user.username);
    } else {
      console.error(xhr3.statusText);   

    }
  };

  xhr3.onerror = function() {
    console.error(xhr3.statusText);   
  };
  
  xhr3.send();
}
getUserDeatails();

document.getElementById("profile_icon").addEventListener('click', updateProfileDetails);
function updateProfileDetails(){
  document.getElementById("profileBar").innerHTML = `<br>Username: `+ user.username;
  xhr4.open("GET", "./checkins");
   xhr4.onload = function() {
    if (xhr4.status === 200) {
      const response = JSON.parse(xhr4.responseText);
      console.log(response);  
      checkins = response;
      for(let x=0; x<checkins.length; x++){
        document.getElementById("profileBar").innerHTML += `<br>Checked Into: `+JSON.stringify(checkins[x].event);
      }
    } else {
      console.error(xhr4.statusText);   

    }
  };

  xhr4.onerror = function() {
    console.error(xhr4.statusText);   
  };
  
  xhr4.send();
}

function checkIn(vendername){
  Swal.fire({
    icon: 'success',
    title: 'Check-in',
    html:'<form action="/checkin" method="post"> <label for="username">Username:</label><br><input type="text" readonly id="username" name="username"><br><label for="lat">lat:</label><br><input type="text" readonly id="lat" name="lat"><br><label for="lon">lon:</label><br><input type="text" readonly id="lon" name="lon"><br><label for="event">event:</label><br><input type="text" id="event" name="event"><br><label for="note">note:</label><br><input type="text" id="note" name="note"><br><label for="group">group:</label><br><input type="text" id="group" name="group"><br><br><input type="submit" value="Submit">  </form>',
    target: document.body
  })
  document.getElementById("username").value = user.username;
  if(vendername){
    document.getElementById("event").value = vendername;
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const latitude = position.coords.latitude;
        document.getElementById("lat").value = latitude;
        const longitude = position.coords.longitude;
        document.getElementById("lon").value = longitude;
        //console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      },
      function(error) {
        console.error(`Geolocation error: ${error.message}`);
      }
    );
  } 
  else {
    console.error('Geolocation not supported');
}}

function checkInVendor(package){
  console.log("checkinVendero is called")
  const arrLoad = package.split(",");
  Swal.fire({
    icon: 'success',
    title: 'Check-in',
    html:'<form action="/checkin" method="post"> <label for="username">Username:</label><br><input type="text" readonly id="username" name="username"><br><label for="lat">lat:</label><br><input type="text" readonly id="lat" name="lat"><br><label for="lon">lon:</label><br><input type="text" readonly id="lon" name="lon"><br><label for="event">event:</label><br><input type="text" readonly id="event" name="event"><br><label for="note">note:</label><br><input type="text" id="note" name="note"><br><label for="group">group:</label><br><input type="text" id="group" name="group"><br><br><input type="submit" value="Submit">  </form>',
    target: document.body
  })
  document.getElementById("username").value = user.username;
  if(arrLoad[0]){
    document.getElementById("event").value = arrLoad[0];
  }
        document.getElementById("lat").value = arrLoad[1];
        document.getElementById("lon").value = arrLoad[2];
}

var div_event_stacks = [];
function destory_event_divs(){
  for(let x=0; x<div_event_stacks.length; x++){
    ///div_ele = document.getElementById("div_event_" + x);
    div_event_stacks[x].remove()
  }
}

let destory = false;
function build_search_event_div(temp_events){
    //alert(document.getElementById("searchInputValue").value.length)
  if(document.getElementById("searchInputValue").value.length < 1){
    //Get rid of all the event divs
    //alert("hello")
    destory_event_divs();
  }
  else if(destory == false){
    for(let x=0; x<temp_events.length; x++){
      let div_ele = document.createElement("div");
      div_ele.id = "div_event_" + x;
      div_ele.className = "divEvents"
      div_ele.innerHTML = temp_events[x].name;
      div_event_stacks.push(div_ele);
      document.getElementById("div_events_container").appendChild(div_ele);
      div_ele.addEventListener('click', function() {
        map.flyTo({
          center: [temp_events[x].geocodes.main.longitude, temp_events[x].geocodes.main.latitude],
          zoom: 21, // Zoom level
          essential: true // This animation is considered essential with respect to prefers-reduced-motion
        });
      });
    }
    destory = true;
  }
  else if ( destory == true){
    destory_event_divs();
    for(let x=0; x<temp_events.length; x++){
      let div_ele = document.createElement("div");
      div_ele.id = "div_event_" + x;
      div_ele.className = "divEvents"
      div_ele.innerHTML = temp_events[x].name;
      div_event_stacks.push(div_ele);
      document.getElementById("div_events_container").appendChild(div_ele);
      div_ele.addEventListener('click', function() {
        map.flyTo({
          center: [temp_events[x].geocodes.main.longitude, temp_events[x].geocodes.main.latitude],
          zoom: 14, // Zoom level
          essential: true // This animation is considered essential with respect to prefers-reduced-motion
        });
      });
      //console.log(temp_events)
    }
  }
}






  