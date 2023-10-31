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

/*map.on('style.load', () => {
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
});*/

      // Agrega un marcador para la ubicación del usuario
      const marker = new mapboxgl.Marker({
        color: 'blue', // Puedes personalizar el color
      });

      // Obtén la ubicación del usuario
      if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(
          (position) => {
            const userLocation = [position.coords.longitude, position.coords.latitude];
            marker.setLngLat(userLocation).addTo(map);
          },
          (error) => console.error(error),
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
        );
      } else {
        alert('Geolocalización no soportada en tu navegador.');
      }

// origen: -73.10515204039719, 7.117600867770329
// destino: -73.10485635258865, 7.116362027256661 

// https://api.mapbox.com/directions/v5/mapbox/walking/-73.10515204039719,7.117600867770329;-73.10485635258865,7.116362027256661?geometries=geojson&access_token=pk.eyJ1IjoicmVub25paWkiLCJhIjoiY2xsb2Nycmx5MDhhNTNkbjN0MDB6aWlmcCJ9.xpvSwfw6tyzCXUvvh8o9_g

/*const biblioteca = [-73.1048753297499, 7.116379831313457];
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
});*/


document.addEventListener('DOMContentLoaded', () => {
    const coordinates = {
      'Edificio L': [-73.10552104917086, 7.116410248939629],
      'Biblioteca': [-73.10455813616838, 7.116491426104427],
      'Edificio A': [-73.10531869830501, 7.117006239492608],
      'Edificio K': [-73.10562292120848, 7.115958237783039],
      'Edificio J': [-73.10548210520987, 7.1159688839790824],
      'Edificio I': [ -73.10525814077576, 7.115979530175419],
      'Edificio H': [-73.1049926021054, 7.116019453409494],
      'Edificio G': [-73.10492823948422, 7.116173838382061 ],
      'Edificio E': [-73.10513314535217, 7.116550974187346],
      'Edificio F': [-73.10500703579545, 7.116502675291846],
      'Edificio D': [-73.10518882302699, 7.117369562983552],
      'Edificio N': [-73.10518882302699, 7.117369562983552],
      'Edificio EA': [-73.1048518491465, 7.1169828690525625],
      'Auditorio Mayor': [-73.10476647502816, 7.116913301890716],
      'Auditorio Menor': [-73.10518882302699, 7.117369562983552],
      'Auditorio Ingenierías': [-73.10521095073307, 7.116368588644064],
      // Agrega las coordenadas para los otros lugares aquí
    };
  
    const originSelect = document.getElementById('originSelect');
    const destinationSelect = document.getElementById('destinationSelect');
    const calculateButton = document.getElementById('calculateRoute');
  
    calculateButton.addEventListener('click', generateRoute);
  
    async function generateRoute() {
      const originText = originSelect.innerText;
      const destinationText = destinationSelect.innerText;

    const allowedRange = {
      minLatitude: 7.1160526250352545, // Límite inferior de latitud
      maxLatitude: 7.11795746697558, // Límite superior de latitud
      minLongitude: -73.10581772183204, // Límite inferior de longitud
      maxLongitude: -73.10416164124416, // Límite superior de longitud
    };
  
      if (originText === 'Seleccione origen' || destinationText === 'Seleccione destino') {
        // Asegúrate de que ambas selecciones se hayan realizado.
        return;
      }
  
      // Obtiene las coordenadas de origen y destino
      const originCoords = coordinates[originText];
      const destinationCoords = coordinates[destinationText];
  
      if (originCoords && destinationCoords) {
        // Hacer la solicitud de ruta
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/walking/${originCoords[0]},${originCoords[1]};${destinationCoords[0]},${destinationCoords[1]}?steps=true&geometries=geojson&access_token=pk.eyJ1IjoicmVub25paWkiLCJhIjoiY2xsb2Nycmx5MDhhNTNkbjN0MDB6aWlmcCJ9.xpvSwfw6tyzCXUvvh8o9_g`,
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
  
        // Si la ruta ya existe en el mapa, la reseteamos con setData
        if (map.getSource('route')) {
          map.getSource('route').setData(geojson);
        } else {
          // De lo contrario, agregamos una nueva capa
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

         map.flyTo({
          center: destinationCoords, // El centro del mapa 
          zoom: 21, // nivel de zoom deseado
          speed: 1, // Velocidad de la animación
        });

        setTimeout(() => {
          map.flyTo({
            center: originCoords, // El centro del mapa 
            zoom: 21, // nivel de zoom deseado
            speed: 0.5, // Velocidad de la animación
          });
        }, 1500); // 2000 milisegundos (2 segundos) de retraso, puedes ajustar este valor.

      }
    }
  });
  