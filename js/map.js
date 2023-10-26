mapboxgl.accessToken = 'pk.eyJ1IjoicmVub25paWkiLCJhIjoiY2xsb2Nycmx5MDhhNTNkbjN0MDB6aWlmcCJ9.xpvSwfw6tyzCXUvvh8o9_g'

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/renoniii/clmjnbima042e01madqscdoks',
    center: [-73.1055606019952, 7.1167001059252236],
    zoom: 17.5,
    bearing: 90,
    pitch: 55
});

//límites del mapa
const bounds = [
    [-73.10645,7.11553],
    [-73.10407,7.11767]
  ];
  map.setMaxBounds(bounds);

const tb = (window.tb = new Threebox(
    map,
    map.getCanvas().getContext('webgl'),
    {
        defaultLights: true
    }
));

map.on('style.load', () => {
    map.addLayer({
        id: 'custom-threebox-model',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function () {
            // Creative Commons License attribution:  Metlife Building model by https://sketchfab.com/NanoRay
            // https://sketchfab.com/3d-models/metlife-building-32d3a4a1810a4d64abb9547bb661f7f3
            const scale = 1;
            const options = {
                obj: 'https://docs.mapbox.com/mapbox-gl-js/assets/metlife-building.gltf',
                type: 'gltf',
                scale: { x: scale, y: scale, z: 2.7 },
                units: 'meters',
                rotation: { x: 90, y: -90, z: 0 }
            };
            
            tb.loadObj(options, (model) => {
                model.setCoords([-73.1055606019952, 7.1167001059252236]);
                model.setRotation({ x: 0, y: 0, z: 241 });
                tb.add(model);
            });
        },
            
        render: function () {
            tb.update();
        }
    });
});
    