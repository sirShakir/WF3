   
const xhr = new XMLHttpRequest();
const xhr2 = new XMLHttpRequest();
const xhr3 = new XMLHttpRequest();
const xhr4 = new XMLHttpRequest();
let xhrtemp = new XMLHttpRequest();

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
  let apiValue = document.getElementById("actionButton").innerHTML;

  xhr.open("GET", "./getbars/" + apiValue);
   
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

function reset_load_all(){
//console.log(events_all.results)
  for(let x=0; x<events_all.results.length; x++){
    map.removeLayer(events_all.results[x].marker);
  }
  for(let x=0; x<pulsing_markers_all.length; x++){
    map.removeLayer(pulsing_markers_all[x]);
  }
  checkins_all = [];
  events_all = [];
  load1_checkins();
 //load2_events();
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
        let package = [encodedName, "na" ,lat1 ,"na", lon1]
        let packageString = encodedName+"comma"+lat1+"comma"+lon1;
        var html = '<button onclick="checkInVendor(\'' + packageString.toString ( ) + '\')" type="button" class="btn btn-success">Checkin</button>';
        if(element.location.formatted_address){
          let marker = L.marker([element.geocodes.main.latitude, element.geocodes.main.longitude]).addTo(map);
          marker.bindPopup('<h2>'+element.name+'</h2> <br> <p>'+element.location.formatted_address+'<p/> <p> Checkin count is: '+ JSON.stringify(event_checkins.length) +`</p><br>` + html)
          markers.push(marker);
          element.marker = marker
        }else{
          let marker = L.marker([element.geocodes.main.latitude, element.geocodes.main.longitude]).addTo(map);
          marker.bindPopup('<h2>'+element.name+'</h2><p> No checkins available.</p><br>' + html)
          markers.push(marker);
          element.marker = marker
        }
        //console.log(events_all)
  });
  build_pulsating_markers()
}
let pulsing_markers_all = [];
function build_pulsating_markers(){

  for(var x=0; x<events_all.results.length; x++){ 
    let checkin_event_count = 0;
    var pulsingIconS = L.icon.pulse({iconSize:[10,10],color:'yellow'});
    var pulsingIconM = L.icon.pulse({iconSize:[20,20],color:'orange'});
    var pulsingIconB = L.icon.pulse({iconSize:[30,30],color:'red'});

    for(let y=0; y<checkins_all.length; y++){
      if(checkins_all[y].event == events_all.results[x].name){
        checkin_event_count++;
      }
    }

    if(checkin_event_count == 0){
    }
    else if(checkin_event_count == 1){
      var marker = L.marker([events_all.results[x].geocodes.main.latitude, events_all.results[x].geocodes.main.longitude],{icon: pulsingIconS}).addTo(map);
      pulsing_markers_all.push(marker);
    }
    else if(checkin_event_count == 2){
      var marker = L.marker([events_all.results[x].geocodes.main.latitude, events_all.results[x].geocodes.main.longitude],{icon: pulsingIconM}).addTo(map); 
      pulsing_markers_all.push(marker);

    }
    else if(checkin_event_count >= 3){
      var marker = L.marker([events_all.results[x].geocodes.main.latitude, events_all.results[x].geocodes.main.longitude],{icon: pulsingIconB}).addTo(map);  
      pulsing_markers_all.push(marker);

    }
  }
}


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
  //console.log(package)
  //console.log("checkinVendero is called")
  const arrLoad = package.split("comma");
  //console.log(arrLoad)
  Swal.fire({
    icon: 'success',
    title: 'Check-in',
    html:'<form action="/checkin" method="post" id="vendor-form"> <label for="username">Username:</label><br><input type="text" readonly id="username" name="username"><br><label for="lat">lat:</label><br><input type="text" readonly id="lat" name="lat"><br><label for="lon">lon:</label><br><input type="text" readonly id="lon" name="lon"><br><label for="event">event:</label><br><input type="text" readonly id="event" name="event"><br><label for="note">note:</label><br><input type="text" id="note" name="note"><br><label for="group">group:</label><br><input type="text" id="group" name="group"><br><br><input type="submit" value="Submit">  </form>',
    target: document.body
  })


  document.getElementById("username").value = user.username;
  if(arrLoad[0]){
    document.getElementById("event").value = arrLoad[0];
  }
  document.getElementById("lat").value = arrLoad[1];
  document.getElementById("lon").value = arrLoad[2];

  const form = document.getElementById('vendor-form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const url = './checkin';
    const data = { 
    username: document.getElementById("username").value, 
    lat: document.getElementById("lat").value, 
    lon: document.getElementById("lon").value, 
    event: document.getElementById("event").value, 
    note: document.getElementById("note").value, 
    group: document.getElementById("group").value, 
    };
  //console.log(data);

    const jsonData = JSON.stringify(data);
    
    xhrtemp.open('POST', url, true);
    xhrtemp.setRequestHeader('Content-Type', 'application/json');
    
    xhrtemp.onreadystatechange = function() {
      if (xhrtemp.readyState === 4 && xhrtemp.status === 200) {
        //console.log(xhrtemp.responseText);
        Swal.close();
        reset_load_all()
      }
    };
    
    xhrtemp.send(jsonData);
  });
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
        // map.flyTo({
        //   center: [temp_events[x].geocodes.main.longitude, temp_events[x].geocodes.main.latitude],
        //   zoom: 21, // Zoom level
        //   essential: true // This animation is considered essential with respect to prefers-reduced-motion
        // });
        map.setView([temp_events[x].geocodes.main.latitude, temp_events[x].geocodes.main.longitude], 19);

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
        // map.flyTo({
        //   center: [temp_events[x].geocodes.main.longitude, temp_events[x].geocodes.main.latitude],
        //   zoom: 14, // Zoom level
        //   essential: true // This animation is considered essential with respect to prefers-reduced-motion
        // });
        map.setView([temp_events[x].geocodes.main.latitude, temp_events[x].geocodes.main.longitude], 19);
      });
      //console.log(temp_events)
    }
  }
}







var dropdownMenu = document.getElementById('my-dropdown');

dropdownMenu.addEventListener('click', function(event) {
  if (event.target.classList.contains('dropdown-item')) {
    var selectedValue = event.target.getAttribute('data-value');
    document.getElementById('actionButton').innerHTML = selectedValue.toUpperCase();
    reset_load_all();
  }
});





  