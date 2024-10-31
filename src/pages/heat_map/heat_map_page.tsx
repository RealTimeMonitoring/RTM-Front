import { Platform, Text, View, useWindowDimensions } from 'react-native';
import { heatMapStyle } from './heat_map.style';
import {
  GoogleMap,
  HeatmapLayer,
  useJsApiLoader,
} from '@react-google-maps/api';
import MapView, { Heatmap } from './map';
import { useState } from 'react';

export default function HeatMapPage(props: { isLoaded: boolean | false }) {
  // 64 header height
  const styles = heatMapStyle(useWindowDimensions().height - 64);

  const [map, setMap] = useState<google.maps.Map>();

  return (
    <View style={styles.view}>
      {Platform.OS === 'web' ? (
        props.isLoaded ? (
          <GoogleMap
            onLoad={(map) => setMap(map)}
            mapContainerStyle={styles.map}
            center={{
              lat: -29.44454866661596,
              lng: -51.9564097589734,
            }}
            zoom={12}
          >
            {map && (
              <HeatmapLayer
                options={{
                  radius: 20,
                }}
                data={[
                  new google.maps.LatLng(-29.44454866661596, -51.9564097589734),
                ]}
              ></HeatmapLayer>
            )}
          </GoogleMap>
        ) : (
          <Text>Carregando...</Text>
        )
      ) : (
        <MapView
          style={styles.map}
          provider='google'
          googleMapId='8e11dbeb36dc205f'
          initialRegion={{
            latitude: -29.44454866661596,
            longitude: -51.9564097589734,
            latitudeDelta: 0.04,
            longitudeDelta: 0,
          }}
        >
          <Heatmap
            gradient={{
              colorMapSize: 256, // Tamanho do mapa de cores
              colors: ['green', 'yellow', 'red'], // Gradiente de cores
              startPoints: [0.1, 0.5, 1.0], // Pontos de início das cores
            }}
            opacity={0.7}
            radius={20}
            points={[
              {
                latitude: -29.44454866661596,
                longitude: -51.9564097589734,
                weight: 1,
              },
              {
                latitude: -29.44454866661596,
                longitude: -51.9564097589734,
                weight: 1,
              },
              {
                latitude: -29.44454866661596,
                longitude: -51.9564097589734,
                weight: 1,
              },
              {
                latitude: -29.44454866661596,
                longitude: -51.9564097589734,
                weight: 1,
              },
            ]}
          />
        </MapView>
      )}
    </View>
  );
}
