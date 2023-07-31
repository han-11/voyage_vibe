
mapboxgl.accessToken = mapToken;


const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker({ color: 'black'})
.setLngLat(campground.geometry.coordinates)
.setPopup(
  new mapboxgl.Popup({offset: 25})
    .setHTML(
      `<p><b> ${campground.title} </b> </p> <p>${campground.location}</p>`
    )
)
.addTo(map);