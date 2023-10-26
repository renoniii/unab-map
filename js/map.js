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

// origen: -73.10515204039719, 7.117600867770329
// destino: -73.10485635258865, 7.116362027256661 

// https://api.mapbox.com/directions/v5/mapbox/walking/-73.10515204039719,7.117600867770329;-73.10485635258865,7.116362027256661?geometries=geojson&access_token=pk.eyJ1IjoicmVub25paWkiLCJhIjoiY2xsb2Nycmx5MDhhNTNkbjN0MDB6aWlmcCJ9.xpvSwfw6tyzCXUvvh8o9_g

const biblioteca = [-73.1048753297499, 7.116379831313457];
const edificioL = [-73.1055168237295, 7.1164106547788];
const auditorioMenor = [-73.10514922695259, 7.1176332185346345];

async function getRoute(end) {
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/cycling/${biblioteca[0]},${biblioteca[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=pk.eyJ1IjoicmVub25paWkiLCJhIjoiY2xsb2Nycmx5MDhhNTNkbjN0MDB6aWlmcCJ9.xpvSwfw6tyzCXUvvh8o9_g`,
    { method: 'GET' }
  );
  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;
  const geojson = {
    'type': 'Feature',
    'properties': {},
    'geometry': {
      'type': 'LineString',
      'coordinates': route
    }
  };
  // if the route already exists on the map, we'll reset it using setData
  if (map.getSource('route')) {
    map.getSource('route').setData(geojson);
  }
  // otherwise, we'll make a new request
  else {
    map.addLayer({
      'id': 'route',
      'type': 'line',
      'source': {
        'type': 'geojson',
        'data': geojson
      },
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#3887be',
        'line-width': 5,
        'line-opacity': 0.75
      }
    });
  }
}

map.on('load', () => {
  // make an initial directions request that
  // starts and ends at the same location
  getRoute(biblioteca);

  // Add starting point to the map
  map.addLayer({
    'id': 'point',
    'type': 'circle',
    'source': {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'Point',
              'coordinates': biblioteca
            }
          }
        ]
      }
    },
    'paint': {
      'circle-radius': 10,
      'circle-color': '#3887be'
    }
  });

  map.on('click', (event) => {
    const coords = Object.keys(event.lngLat).map(
      (key) => event.lngLat[key]
    );
    const end = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'Point',
            'coordinates': coords
          }
        }
      ]
    };
    if (map.getLayer('end')) {
      map.getSource('end').setData(end);
    } else {
      map.addLayer({
        'id': 'end',
        'type': 'circle',
        'source': {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': [
              {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                  'type': 'Point',
                  'coordinates': coords
                }
              }
            ]
          }
        },
        'paint': {
          'circle-radius': 10,
          'circle-color': '#f30'
        }
      });
    }
    getRoute(coords);
  });
});

  