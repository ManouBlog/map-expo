import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  useColorScheme,
//   Platform,
  StatusBar,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheetContent from '../../components/BottomSheetContent';

const ABIDJAN_REGION = {
  latitude: 5.3600,
  longitude: -4.0083,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const MOCK_SALONS = [
  {
    id: '1',
    name: 'Coiffure Prestige',
    latitude: 5.3650,
    longitude: -4.0100,
    rating: 4.8,
    reviews: 124,
    address: 'Cocody, Abidjan',
    phone: '+225 07 12 34 56 78',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
  },
  {
    id: '2',
    name: 'Salon Elite',
    latitude: 5.3580,
    longitude: -4.0050,
    rating: 4.6,
    reviews: 89,
    address: 'Plateau, Abidjan',
    phone: '+225 07 98 76 54 32',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
  },
  {
    id: '3',
    name: 'Style & Beauty',
    latitude: 5.3620,
    longitude: -4.0120,
    rating: 4.9,
    reviews: 203,
    address: 'Marcory, Abidjan',
    phone: '+225 05 11 22 33 44',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800',
  },
  {
    id: '4',
    name: 'Afro Touch',
    latitude: 5.3550,
    longitude: -4.0030,
    rating: 4.7,
    reviews: 156,
    address: 'Yopougon, Abidjan',
    phone: '+225 01 55 66 77 88',
    image: 'https://images.unsplash.com/photo-1595475884562-073c30d45670?w=800',
  },
  {
    id: '5',
    name: 'Royal Hair',
    latitude: 5.3590,
    longitude: -4.0140,
    rating: 4.5,
    reviews: 78,
    address: 'Treichville, Abidjan',
    phone: '+225 07 44 55 66 77',
    image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800',
  },
];

export default function MapScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [selectedSalon, setSelectedSalon] = useState<typeof MOCK_SALONS[0] | null>(null);

  const animatedPosition = useSharedValue(0);
  const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    })();
  }, []);

  const handleMyLocation = useCallback(() => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      mapRef.current?.animateToRegion(ABIDJAN_REGION);
    }
  }, [userLocation]);

  const handleMarkerPress = useCallback((salon: typeof MOCK_SALONS[0]) => {
    setSelectedSalon(salon);
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    setSelectedSalon(null);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

//   const animatedMapStyle = useAnimatedStyle(() => {
//     const paddingBottom = interpolate(
//       animatedPosition.value,
//       [0, 1, 2],
//       [0, 250, 600],
//       Extrapolation.CLAMP
//     );
//     return {
//       paddingBottom,
//     };
//   });

  return (
    <>
     <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
         <Animated.View style={[styles.mapContainer]}>
            
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={ABIDJAN_REGION}
          showsPointsOfInterest={false}
          showsBuildings={false}
          loadingEnabled
          showsTraffic={false}
          showsIndoors={false}
          showsUserLocation
          showsMyLocationButton={false}
          customMapStyle={isDark ? darkMapStyle : []}
        >
          {MOCK_SALONS.map((salon) => (
            <Marker
              key={salon.id}
              coordinate={{
                latitude: salon.latitude,
                longitude: salon.longitude,
              }}
              onPress={() => handleMarkerPress(salon)}
            >
              <View
                style={[
                  styles.markerContainer,
                  selectedSalon?.id === salon.id && styles.markerSelected,
                ]}
              >
                <Ionicons name="cut" size={20} color="#fff" />
              </View>
            </Marker>
          ))}
        </MapView>
          <View style={[styles.searchContainer, { top: insets.top + 10}]}>
        <View style={[styles.searchBar, isDark && styles.searchBarDark]}>
          <Ionicons
            name="search"
            size={20}
            color={isDark ? '#8E8E93' : '#999'}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, isDark && styles.searchInputDark]}
            placeholder="Rechercher un salon..."
            placeholderTextColor={isDark ? '#8E8E93' : '#999'}
          />
        </View>
      </View>
        <TouchableOpacity
        style={[
          styles.myLocationButton,
          isDark && styles.myLocationButtonDark,
          { bottom: insets.bottom + 10 },
        ]}
        onPress={handleMyLocation}
      >
        <Ionicons name="locate" size={24} color="#007AFF" />
      </TouchableOpacity>
      
        <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={[
          styles.bottomSheetBackground,
          isDark && styles.bottomSheetBackgroundDark,
        ]}
        handleIndicatorStyle={[
          styles.handleIndicator,
          isDark && styles.handleIndicatorDark,
        ]}
        animatedPosition={animatedPosition}
      >
        {selectedSalon && (
          <BottomSheetContent salon={selectedSalon} onClose={handleClose} />
        )}
       
      </BottomSheet>
      </Animated.View>
      
  </>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchBarDark: {
    backgroundColor: '#1C1C1E',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  searchInputDark: {
    color: '#fff',
  },
  myLocationButton: {
    position: 'absolute',
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  myLocationButtonDark: {
    backgroundColor: '#1C1C1E',
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerSelected: {
    backgroundColor: '#FF3B30',
    transform: [{ scale: 1.2 }],
  },
  bottomSheetBackground: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetBackgroundDark: {
    backgroundColor: '#1C1C1E',
  },
  handleIndicator: {
    backgroundColor: '#D1D1D6',
  },
  handleIndicatorDark: {
    backgroundColor: '#48484A',
  },
});