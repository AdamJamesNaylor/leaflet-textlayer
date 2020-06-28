const accessToken = 'pk.eyJ1IjoibWFwc29mc3VtaXQiLCJhIjoiY2p4bHJvZzczMDNkMzN4bzM0OWkyNjJiMiJ9.OeORcEVrnlz4Ig-WnQNb6g';

const mapboxTiles1 = L.tileLayer(
    `https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=${accessToken}`,
    {
        attribution:
        '&copy; <a href="https://www.mapbox.com/feedback/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }
);

const mapboxTiles2 = L.tileLayer(
    `https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=${accessToken}`,
    {
        attribution:
        '&copy; <a href="https://www.mapbox.com/feedback/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }
);

let options = {
    tooltip: { className: "text-layer"}
};

const map1 = L.map("map1")
    .setView([51.505, -0.09], 13)
    .addLayer(mapboxTiles1);

let textlayer3 = L.textLayer("Some Text", [51.505, -0.09], options)
                  .addTo(map1);

let readonlyOptions = {
    tooltip: { className: "text-layer" },
    enabled: false
};
let textLayer2 = L.textLayer("Read only", [51.500, -0.09], readonlyOptions)
                  .addTo(map1)

const map2 = L.map("map2")
  .setView([51.505, -0.09], 13)
  .addLayer(mapboxTiles2);

map2.pm.addControls({
    drawMarker: true,
    drawPolygon: true,
    editPolygon: true,
    drawPolyline: true,
    deleteLayer: true,
  });

let textLayer = L.textLayer("Some Text", [51.505, -0.09], options)
                  .addTo(map2);
map2.on('pm:globaldragmodetoggled', e => {
  if (textLayer.isEnabled) {
    console.log("disabling");
    textLayer.disable();
  } else {
    console.log("enabling");
    textLayer.enable();
  }
});