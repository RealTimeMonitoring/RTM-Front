import { Platform, Text, View, useWindowDimensions } from 'react-native';
import { heatMapStyle } from './heat_map.style';
import { GoogleMap, HeatmapLayer } from '@react-google-maps/api';
import MapView, { Heatmap } from './map';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import WmData from '../../models/WmData';
import { fetchData } from '../../data/service/WMdataService';
import { LoaderContext } from '../../contexts/ScreenLoader';
import { WmCategory } from '../../models/WmCategory';
import Selector from '../../components/Picker';
import { fetchCategories } from '../../data/service/WMCategoryService';

interface LatLngItem {
  latitude: string;
  longitude: string;
}

interface HeatMapData {
  items: LatLngItem[];
  categories: WmCategory[];
}

export default function HeatMapPage(props: { isLoaded: boolean | false }) {
  const styles = heatMapStyle(useWindowDimensions().height - 64);

  const [map, setMap] = useState<google.maps.Map>();
  const [data, setData] = useState<HeatMapData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<WmCategory | null>(
    null
  );

  const { loading, showLoader, hideLoader } = useContext(LoaderContext);

  useEffect(() => {
    const fetch = async () => {
      showLoader();

      try {
        const [datas, categories] = await Promise.all([
          fetchData(),
          fetchCategories(),
        ]);

        const locationData = datas.map((item) => ({
          latitude: item.latitude,
          longitude: item.longitude,
        }));

        setData({ items: locationData, categories });
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        hideLoader();
      }
    };

    fetch();
  }, []);

  const getGoogleLatLngData = () =>
    data?.items.map(
      (item) =>
        new google.maps.LatLng(
          parseFloat(item.latitude),
          parseFloat(item.longitude)
        )
    ) ?? [];

  const getHeatmapPoints = () =>
    data?.items
      .map((item) => ({
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
        weight: 1,
      }))
      .filter((point) => !isNaN(point.latitude) && !isNaN(point.longitude)) ??
    [];

  return (
    <View style={styles.view}>
      <View style={styles.viewContainer}>
        <Selector
          style={styles.picker}
          items={data?.categories ?? []}
        ></Selector>
        {loading ? (
          <View></View>
        ) : Platform.OS === 'web' ? (
          props.isLoaded ? (
            <GoogleMap
              onLoad={(map) => setMap(map)}
              mapContainerStyle={styles.map}
              zoom={12}
              center={{
                lat: -29.44454866661596,
                lng: -51.9564097589734,
              }}
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
                colorMapSize: 256,
                colors: ['green', 'yellow', 'red'],
                startPoints: [0.1, 0.5, 1.0],
              }}
              opacity={0.7}
              radius={20}
              points={getHeatmapPoints()}
            />
          </MapView>
        )}
      </View>
    </View>
  );
}
