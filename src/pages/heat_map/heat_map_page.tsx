import { Platform, Text, View, useWindowDimensions } from "react-native";
import { heatMapStyle } from "./heat_map.style";
import { GoogleMap, HeatmapLayer } from "@react-google-maps/api";
import MapView, { Heatmap } from "./map";
import { useEffect, useState } from "react";
import WmData from "../../models/WmData";
import { fetchData } from "../../data/service/WMdataService";

interface LatLngItem {
  latitude: string;
  longitude: string;
}

export default function HeatMapPage(props: { isLoaded: boolean | false }) {
  const styles = heatMapStyle(useWindowDimensions().height - 64);

  const [map, setMap] = useState<google.maps.Map>();
  const [items, setItems] = useState<LatLngItem[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const items: WmData[] = await fetchData();

        const locationData = items.map((item) => ({
          latitude: item.latitude,
          longitude: item.longitude,
        }));

        setItems(locationData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetch();
  }, []);

  const getGoogleLatLngData = () =>
    items.map(
      (item) =>
        new google.maps.LatLng(
          parseFloat(item.latitude),
          parseFloat(item.longitude)
        )
    );

  const getHeatmapPoints = () =>
    items
      .map((item) => ({
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
        weight: 1,
      }))
      .filter((point) => !isNaN(point.latitude) && !isNaN(point.longitude));

  return (
    <View style={styles.view}>
      {Platform.OS === "web" ? (
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
                data={getGoogleLatLngData()}
              ></HeatmapLayer>
            )}
          </GoogleMap>
        ) : (
          <Text>Carregando...</Text>
        )
      ) : (
        <MapView
          style={styles.map}
          provider="google"
          googleMapId="8e11dbeb36dc205f"
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
              colors: ["green", "yellow", "red"], // Gradiente de cores
              startPoints: [0.1, 0.5, 1.0], // Pontos de início das cores
            }}
            opacity={0.7}
            radius={20}
            points={getHeatmapPoints()}
          />
        </MapView>
      )}
    </View>
  );
}
