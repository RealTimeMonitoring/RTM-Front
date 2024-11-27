import { GoogleMap, HeatmapLayer } from '@react-google-maps/api';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import { DateType } from 'react-native-ui-datepicker/lib/typescript/src/types';
import Selector from '../../components/Picker';
import { LoaderContext } from '../../contexts/ScreenLoader';
import { WmCategory } from '../../data/models/WmCategory';
import { fetchPermittedCategories } from '../../data/service/WMCategoryService';
import { fetchPermittedData } from '../../data/service/WMdataService';
import filterPoint from '../../utils/formatHeapMapPoint';
import { heatMapStyle } from './heat_map.style';
import MapView, { Heatmap, LatLng, PROVIDER_GOOGLE } from './map';
import { Dayjs } from 'dayjs';
import CustomModal from '../../components/Modal';
import Input from '../../components/Input';
import Checkbox from 'expo-checkbox';

interface LatLngItem {
  latitude: string;
  longitude: string;
}

interface HeatMapData {
  items: LatLngItem[];
  categories: WmCategory[];
}

export default function HeatMapPage(props: { isLoaded: boolean | false }) {
  const styles = heatMapStyle(
    useWindowDimensions().height - (Platform.OS === 'web' ? 64 : 0)
  );

  const [filterStartDate, setFilterStartDate] = useState<Date>(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [showDateStartPicker, setShowPickerStartDate] = useState(false);

  const [filterEndDate, setFilterEndDate] = useState<Date>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  const [showDateEndPicker, setShowPickerEndDate] = useState(false);

  const [dataStatus, setDataStatus] = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [selectedCategory, setSelectedCategory] = useState<
    WmCategory | undefined
  >(undefined);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [data, setData] = useState<HeatMapData | null>(null);
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

  const { loading, showLoader, hideLoader } = useContext(LoaderContext);

  useEffect(() => {
    const fetch = async () => {
      showLoader();

      try {
        const [datas, categories] = await Promise.all([
          fetchPermittedData({
            categoryId: selectedCategory?.id.toString(),
            startDate: selectedStartDate,
            endDate: selectedEndDate,
            status: dataStatus,
          }),
          fetchPermittedCategories(),
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
          }));

        setData({ items: locationData, categories });
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        hideLoader();
      }
    };

    fetch();
  }, [selectedCategory, selectedStartDate, selectedEndDate, dataStatus]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setFilteredWebMapsData(filteredWebData);
    }
  }, [selectedCategory, data]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      setFilterMobileMapsData(filteredMobileData);
    }
  }, [selectedCategory, data]);

  const toggleStartDatePicker = useCallback(() => {
    setShowPickerStartDate((show) => !show);
  }, [showDateStartPicker]);

  const onStartDateChange = (date: Dayjs) => {
    setFilterStartDate(date.toDate());
    setSelectedStartDate(date.toDate().toLocaleDateString());
    toggleStartDatePicker();
  };

  const toggleEndDatePicker = useCallback(() => {
    setShowPickerEndDate((show) => !show);
  }, [showDateEndPicker]);

  const onEndDateChange = (date: Dayjs) => {
    setFilterEndDate(date.toDate());
    setSelectedEndDate(date.toDate().toLocaleDateString());
    toggleEndDatePicker();
  };

  const filteredMobileData = useCallback(() => {
    let filteredItems =
      data?.items.filter(
        (point) =>
          filterPoint(Number(point.latitude), true) &&
          filterPoint(Number(point.longitude), false)
      ) ?? [];

    return filteredItems.map((item) => ({
      latitude: Number(item.latitude),
      longitude: Number(item.longitude),
      weight: 1,
    }));
  }, [selectedCategory, data]);

  const filteredWebData = useCallback(() => {
    let filteredItems =
      data?.items.filter(
        (point) =>
          filterPoint(Number(point.latitude), true) &&
          filterPoint(Number(point.longitude), false)
      ) ?? [];

    return filteredItems.map(
      (item) =>
        new google.maps.LatLng(
          parseFloat(item.latitude),
          parseFloat(item.longitude)
        )
    );
  }, [selectedCategory, data]);

  return (
    <View style={styles.view}>
      <View style={styles.viewContainer}>
        {Platform.OS === 'web' && (
          <View style={styles.filterContainer}>
            <Selector
              style={styles.picker}
              items={data?.categories ?? []}
              onChange={(categId) =>
                setSelectedCategory(
                  data?.categories.find((c) => c.id == categId)
                )
              }
            />
            <Pressable onPress={toggleStartDatePicker}>
              <Input
                placeHolder='Selecione a data inicial'
                value={selectedStartDate}
                event={setSelectedStartDate}
                editable={false}
              ></Input>
            </Pressable>
            <Pressable onPress={toggleEndDatePicker}>
              <Input
                placeHolder='Selecione a data final'
                value={selectedEndDate}
                event={setSelectedEndDate}
                editable={false}
              ></Input>
            </Pressable>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                value={dataStatus === 'CLOSED'}
                onValueChange={(newValue) =>
                  setDataStatus(newValue ? 'CLOSED' : 'OPEN')
                }
                color={dataStatus === 'CLOSED' ? '#4CAF50' : undefined}
              />
              <Text style={{ marginLeft: 8 }}>
                {dataStatus === 'CLOSED' ? 'Concluído' : 'Em Aberto'}
              </Text>
            </View>
          </View>
        )}
        {loading ? (
          <View></View>
        ) : Platform.OS === 'web' ? (
          props.isLoaded ? (
            <GoogleMap
              onLoad={(map) => setMap(map)}
              mapContainerStyle={styles.map}
              options={{
                streetViewControl: false,
              }}
              zoom={12}
              center={{
                lat: -29.44454866661596,
                lng: -51.9564097589734,
              }}
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
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            googleMapId='8e11dbeb36dc205f'
            initialRegion={{
              latitude: -29.44454866661596,
              longitude: -51.9564097589734,
              latitudeDelta: 0.04,
              longitudeDelta: 0,
            }}
          >
            {filterMobileMapsData && (
              <Heatmap
                gradient={{
                  colorMapSize: 256,
                  colors: ['green', 'yellow', 'red'],
                  startPoints: [0.1, 0.5, 1.0],
                }}
                opacity={0.7}
                radius={35}
                points={
                  filterMobileMapsData ?? [
                    {
                      latitude: 0,
                      longitude: 0,
                      weight: 0,
                    },
                  ]
                }
              />
            )}
          </MapView>
        )}
      </View>
      <CustomModal
        onClose={toggleStartDatePicker}
        visible={showDateStartPicker}
      >
        <DateTimePicker
          mode='single'
          date={filterStartDate}
          onChange={(value) => onStartDateChange(value.date as Dayjs)}
        />
      </CustomModal>
      <CustomModal onClose={toggleEndDatePicker} visible={showDateEndPicker}>
        <DateTimePicker
          mode='single'
          date={filterEndDate}
          onChange={(value) => onEndDateChange(value.date as Dayjs)}
        />
      </CustomModal>
    </View>
  );
}
