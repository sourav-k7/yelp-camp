mapboxgl.accessToken = 'pk.eyJ1IjoiZGVrdS03IiwiYSI6ImNrbW5vM2FmcDBycmQycGxlY29uZ3gwdGQifQ.ees1f9TCK5Cc2f8Dj_9vbA';
    var map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: camp.geometry.coordinates, // starting position [lng, lat]
      zoom: 9 // starting zoom
    });
    var marker1 = new mapboxgl.Marker()
.setLngLat(camp.geometry.coordinates)
.setPopup(
  new mapboxgl.Popup({offset:25})
  .setHTML(`<h6> ${ camp.title } </h6><p>${camp.location}</p>`)
  
)
.addTo(map);