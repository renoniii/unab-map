mapboxgl.accessToken = 'pk.eyJ1IjoicmVub25paWkiLCJhIjoiY2xsb2Nycmx5MDhhNTNkbjN0MDB6aWlmcCJ9.xpvSwfw6tyzCXUvvh8o9_g'

const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/standard-beta",
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
        id: 'edificio-e',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function () {
            const scale = 1;
            const options = {
                obj: 'edificios/edificio_e.gltf',
                type: 'gltf',
                scale: { x: scale, y: scale, z: 0 },
                units: 'meters',
                rotation: { x: 90, y: -90, z: 0 }
            };
            tb.loadObj(options, (model) => {
                model.setCoords([-73.10525948321644, 7.116404712482975]);
                model.setRotation({ x: 0, y: 0, z: 0 });
                tb.add(model);
            });

            map.setPaintProperty('edificio-e', 'fill-extrusion-color', ['interpolate', ['linear'], ['measure-light'], 0, '#000000', 1, '#FFFFFF']);
            map.setPaintProperty('edificio-e', 'fill-extrusion-opacity', 0.6);
        },
            
        render: function () {
            tb.update();
        }
    });
});

map.on('style.load', () => {
  map.addLayer({
      id: 'edificio-f',
      type: 'custom',
      renderingMode: '3d',
      onAdd: function () {
          const scale = 1;
          const options = {
              obj: 'edificios/edificio_f.gltf',
              type: 'gltf',
              scale: { x: scale, y: scale, z: 0 },
              units: 'meters',
              rotation: { x: 90, y: 90, z: 0 }
          };
          
          tb.loadObj(options, (model) => {
              model.setCoords([-73.10511365580805, 7.116343358845526]);
              model.setRotation({ x: 0, y: 0, z: 0 });
              tb.add(model);
          });
      },
          
      render: function () {
          tb.update();
      }
  });
});

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
      'Edificio L': [-73.10540005049819, 7.116243654244599],
      'Biblioteca': [-73.1048009579892, 7.116269243191439],
      'Edificio A': [-73.10536195812617, 7.116939388398805],
      'Edificio K': [-73.10559540595513, 7.115895512929626],
      'Edificio J': [-73.10549084124615, 7.115935200679047],
      'Edificio I': [-73.10531764146307, 7.115837418937005],
      'Edificio H': [-73.10503782854121, 7.11586047253104],
      'Edificio G': [-73.10493148636156, 7.116113389234101],
      'Edificio E': [-73.1051897489314, 7.116456725853993],
      'Edificio F': [-73.10509085509008, 7.11647035163999],
      'Edificio D': [-73.10511556115115, 7.117166477271439],
      'Edificio N': [-73.10524098511817, 7.11735158843608],
      'Edificio EA': [-73.10484541559677, 7.11700210897348],
      'Auditorio Mayor': [-73.10483040489353, 7.116871685925119],
      'Auditorio Menor': [-73.1050505318933, 7.117406063685024],
      'Auditorio Ingenierías': [-73.10535452483298, 7.116117905601101],
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
  
          // Elimina las capas y fuentes de los marcadores de origen y destino si existen
      if (map.getLayer('origin-point')) {
        map.removeLayer('origin-point');
      }
      if (map.getLayer('origin-point-white')) {
        map.removeLayer('origin-point-white');
      }
      if (map.getLayer('destination-point')) {
        map.removeLayer('destination-point');
      }
      if (map.getLayer('destination-point-white')) {
        map.removeLayer('destination-point-white');
      }
      if (map.getSource('origin-point')) {
        map.removeSource('origin-point');
      }
      if (map.getSource('origin-point-white')) {
        map.removeSource('origin-point-white');
      }
      if (map.getSource('destination-point')) {
        map.removeSource('destination-point');
      }
      if (map.getSource('destination-point-white')) {
        map.removeSource('destination-point-white');
      }

      if (originText === 'Seleccione origen' || destinationText === 'Seleccione destino') {
        // Asegúrate de que ambas selecciones se hayan realizado.
        return;
      }

      // Obtiene las coordenadas de origen y destino
      const originCoords = coordinates[originText];
      const destinationCoords = coordinates[destinationText];

      sidebar.classList.toggle("close");

      if (originCoords && destinationCoords) {
        // Solicitud de ruta
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
          // Agregamos nueva capa para la ruta
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
              'line-color': '#0dc0d9',
              'line-width': 9,
              'line-opacity': 1
            }
          });
        }

        // Agregamos nuevas capas y fuentes para los marcadores de origen y destino
        map.addLayer({
          'id': 'origin-point-white',
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
                    'coordinates': originCoords
                  }
                }
              ]
            }
          },
          'paint': {
            'circle-radius': 10,
            'circle-color': '#FFFFFF'
          }
        });

        map.addLayer({
          'id': 'origin-point',
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
                    'coordinates': originCoords
                  }
                }
              ]
            }
          },
          'paint': {
            'circle-radius': 7,
            'circle-color': '#07ceae'
          }
        });

        map.addLayer({
          'id': 'destination-point-white',
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
                    'coordinates': destinationCoords
                  }
                }
              ]
            }
          },
          'paint': {
            'circle-radius': 10,
            'circle-color': '#FFFFFF'
          }
        });

        map.addLayer({
          'id': 'destination-point',
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
                    'coordinates': destinationCoords
                  }
                }
              ]
            }
          },
          'paint': {
            'circle-radius': 7,
            'circle-color': '#faa204'
          }
        });

        map.flyTo({
          center: destinationCoords,
          zoom: 21,
          speed: 1,
        });

        setTimeout(() => {
          map.flyTo({
            center: originCoords,
            zoom: 21,
            speed: 0.5,
          });
        }, 1500);
      }
    }
  });
