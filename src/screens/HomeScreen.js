import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const HomeScreen = () => {
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This app needs to access your location',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Location permission is required to use this feature');
          return;
        }
      }
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prevState) => ({
            ...prevState,
            latitude,
            longitude,
          }));
        },
        (error) => {
          Alert.alert('Error', error.message);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );

      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prevState) => ({
            ...prevState,
            latitude,
            longitude,
          }));
        },
        (error) => {
          Alert.alert('Error', error.message);
        },
        { enableHighAccuracy: true, distanceFilter: 0 }
      );

      return () => {
        if (watchId) {
          Geolocation.clearWatch(watchId);
        }
      };
    };

    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={location}
        showsUserLocation={true}
        followUserLocation={true}
      >
        <Marker coordinate={location} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default HomeScreen;
