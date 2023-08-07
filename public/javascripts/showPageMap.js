
mapboxgl.accessToken = mapToken;


const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
center: destination.geometry.coordinates, // starting position [lng, lat]
zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker({ color: 'black'})
.setLngLat(destination.geometry.coordinates)
.setPopup(
  new mapboxgl.Popup({offset: 25})
    .setHTML(
      `<p><b> ${destination.title} </b> </p> <p>${destination.location}</p>`
    )
)
.addTo(map);