
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com


fetch("http://localhost:3000/places/All")
.then(response => {
    // indicates whether the response is successful (status code 200-299) or not
    if (!response.ok) {
    throw new Error(`Request failed with status ${reponse.status}`)
    }
    return response.json()
})
.then(data => {
    console.log(data)
    //'pk.eyJ1IjoibWFwYm94LW1hcC1kZXNpZ24iLCJhIjoiY2syeHpiaHlrMDJvODNidDR5azU5NWcwdiJ9.x0uSqSWGXdoFKuHZC5Eo_Q'
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94LW1hcC1kZXNpZ24iLCJhIjoiY2syeHpiaHlrMDJvODNidDR5azU5NWcwdiJ9.x0uSqSWGXdoFKuHZC5Eo_Q';
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
});
})
.catch(error => console.log(error))


//function _0xefe5(_0xd8e001,_0x2b426b){const _0x5e0f3b=_0x5e0f();return _0xefe5=function(_0xefe530,_0x4402c5){_0xefe530=_0xefe530-0x18e;let _0x11b9c4=_0x5e0f3b[_0xefe530];return _0x11b9c4;},_0xefe5(_0xd8e001,_0x2b426b);}const _0x204df0=_0xefe5;(function(_0x45c13b,_0x56d375){const _0x51eb44=_0xefe5,_0x5e11e5=_0x45c13b();while(!![]){try{const _0x3b17a0=parseInt(_0x51eb44(0x1a2))/0x1*(parseInt(_0x51eb44(0x19b))/0x2)+-parseInt(_0x51eb44(0x1a0))/0x3+parseInt(_0x51eb44(0x192))/0x4*(parseInt(_0x51eb44(0x191))/0x5)+parseInt(_0x51eb44(0x19a))/0x6*(-parseInt(_0x51eb44(0x199))/0x7)+parseInt(_0x51eb44(0x190))/0x8+parseInt(_0x51eb44(0x18e))/0x9*(parseInt(_0x51eb44(0x19d))/0xa)+parseInt(_0x51eb44(0x195))/0xb;if(_0x3b17a0===_0x56d375)break;else _0x5e11e5['push'](_0x5e11e5['shift']());}catch(_0x418044){_0x5e11e5['push'](_0x5e11e5['shift']());}}}(_0x5e0f,0xe6645),fetch(_0x204df0(0x198))[_0x204df0(0x194)](_0x37c049=>{const _0x492263=_0x204df0;if(!_0x37c049['ok'])throw new Error(_0x492263(0x196)+reponse['status']);return _0x37c049[_0x492263(0x19f)]();})[_0x204df0(0x194)](_0x1d3389=>{const _0x554ea6=_0x204df0;console[_0x554ea6(0x1a1)](_0x1d3389),mapboxgl[_0x554ea6(0x193)]=_0x554ea6(0x19e);const _0x223b94=new mapboxgl[(_0x554ea6(0x18f))]({'container':_0x554ea6(0x197),'style':'mapbox://styles/mapbox/streets-v12','center':[-74.5,0x28],'zoom':0x9});})[_0x204df0(0x19c)](_0x2e32da=>console['log'](_0x2e32da)));function _0x5e0f(){const _0x46cd12=['then','9525857cejEKj','Request\x20failed\x20with\x20status\x20','map','http://localhost:3000/places/All','1794107oWGbVt','36zmhTJU','74QIPLtR','catch','6881080GbVYQD','pk.eyJ1IjoibWFwYm94LW1hcC1kZXNpZ24iLCJhIjoiY2syeHpiaHlrMDJvODNidDR5azU5NWcwdiJ9.x0uSqSWGXdoFKuHZC5Eo_Q','json','4095843oDUFOH','log','35227SHdgWm','18UvwIGQ','Map','1872112gOEHfe','815iDVhtP','1648QGVjGM','accessToken'];_0x5e0f=function(){return _0x46cd12;};return _0x5e0f();}