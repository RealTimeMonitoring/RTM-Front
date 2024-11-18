import { GoogleMap, HeatmapLayer } from '@react-google-maps/api';
import { useContext, useEffect, useState } from 'react';
import { Platform, Text, View, useWindowDimensions } from 'react-native';
import Selector from '../../components/Picker';
import { LoaderContext } from '../../contexts/ScreenLoader';
import { fetchCategories } from '../../data/service/WMCategoryService';
import { fetchData } from '../../data/service/WMdataService';
import { WmCategory } from '../../models/WmCategory';
import filterPoint from '../../utils/formatHeapMapPoint';
import { heatMapStyle } from './heat_map.style';
import MapView, { Heatmap, LatLng } from './map';

interface LatLngItem {
  latitude: string;
  longitude: string;
  categoryId: number;
}

interface HeatMapData {
  items: LatLngItem[];
  categories: WmCategory[];
}

export default function HeatMapPage(props: { isLoaded: boolean | false }) {
  const styles = heatMapStyle(useWindowDimensions().height - 64);

  const [map, setMap] = useState<google.maps.Map>();
  const [data, setData] = useState<HeatMapData | null>(null);
  const [mobileHeatMapReady, setMobileHeatMapReady] = useState(false);

  const [currentWebMapLocation, setCurrentWebMapLocation] = useState<
    google.maps.LatLng | google.maps.LatLngLiteral | undefined
  >({
    lat: -29.44454866661596,
    lng: -51.9564097589734,
  });

  const [filterWebMapsData, setFilteredWebMapsData] = useState<
    google.maps.LatLng[]
  >([]);

  const [filterMobileMapsData, setFilterMobileMapsData] = useState<
    (LatLng & {
      weight?: number;
    })[]
  >([]);

  const [selectedCategory, setSelectedCategory] = useState<
    WmCategory | undefined
  >(undefined);

  const { loading, showLoader, hideLoader } = useContext(LoaderContext);

  useEffect(() => {
    const fetch = async () => {
      showLoader();

      try {
        const [datas, categories] = await Promise.all([
          fetchData(),
          fetchCategories(),
        ]);

        const locationData = datas
          .filter(
            (data) =>
              !isNaN(parseFloat(data.latitude)) &&
              !isNaN(parseFloat(data.latitude))
          )
          .map((item) => ({
            latitude: item.latitude,
            longitude: item.longitude,
            categoryId: item.category?.id ?? 0,
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

  useEffect(() => {
    let filteredItems =
      data?.items.filter(
        (point) =>
          filterPoint(Number(point.latitude), true) &&
          filterPoint(Number(point.longitude), false)
      ) ?? [];

    if (selectedCategory) {
      filteredItems = filteredItems.filter(
        (item) => item.categoryId === selectedCategory.id
      );
    }

    setFilteredWebMapsData(
      filteredItems.map(
        (item) =>
          new google.maps.LatLng(
            parseFloat(item.latitude),
            parseFloat(item.longitude)
          )
      )
    );
  }, [data?.items, map, selectedCategory]);

  useEffect(() => {
    let filteredItems =
      data?.items.filter(
        (point) =>
          filterPoint(Number(point.latitude), true) &&
          filterPoint(Number(point.longitude), false)
      ) ?? [];

    if (selectedCategory) {
      filteredItems = filteredItems.filter(
        (item) => item.categoryId === selectedCategory.id
      );
    }

    setFilterMobileMapsData(
      filteredItems.map((item) => ({
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
        weight: 1,
      }))
    );
  }, [data?.items, mobileHeatMapReady, selectedCategory]);
  return (
    <View style={styles.view}>
      <View style={styles.viewContainer}>
        <Selector
          style={styles.picker}
          items={data?.categories ?? []}
          onChange={setSelectedCategory}
        ></Selector>
        {loading ? (
          <View></View>
        ) : Platform.OS === 'web' ? (
          props.isLoaded ? (
            <GoogleMap
              onLoad={(map) => setMap(map)}
              mapContainerStyle={styles.map}
              zoom={12}
              center={currentWebMapLocation}
            >
              {map && filterWebMapsData && (
                <HeatmapLayer
                  options={{
                    radius: 20,
                  }}
                  data={filterWebMapsData}
                />
              )}
            </GoogleMap>
          ) : (
            <Text>Carregando...</Text>
          )
        ) : (
          <MapView
            onMapLoaded={() => setMobileHeatMapReady(true)}
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
              radius={35}
              points={filterMobileMapsData}
            />
          </MapView>
        )}
      </View>
    </View>
  );
}
