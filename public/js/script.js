const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
            const {latitude, longitude} = position.coords;
            socket.emit('client-location-send', {latitude, longitude})

        },

      (error)=>{
        console.error('Error getting user location',error);
      },

      {
        enableHighAccuracy:true,
        timeout: 5000,
        maximumAge: 0
      }


    )
}


//create 
const map=L.map('map').setView([0,0],16);

//add tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:"maniranjan"
}).addTo(map)

const markers ={};


socket.on("recieve-location",(data)=>{
    const {id,latitude,longitude} = data;
    map.setView([latitude, longitude],10);

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }

    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);

    }
})


socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})


