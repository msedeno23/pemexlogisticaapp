import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform, Alert, Button } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAvXIU0Bf7rtYVDPqB8C-g4frItTBJ9Fqk';

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

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

    const fetchUserInfo = async () => {
      const user = auth().currentUser;
      if (user) {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          setUserInfo(userDoc.data());
        }
      }
    };

    requestLocationPermission();
    fetchUserInfo();
  }, []);

  const handleDestinationSelect = (data, details) => {
    const { lat, lng } = details.geometry.location;
    setDestination({
      latitude: lat,
      longitude: lng,
      name: details.name,
    });
  };

  const handleRouteReady = (result) => {
    setRoute(result.coordinates);
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="A dónde vamos?"
        minLength={2}
        fetchDetails={true}
        onPress={handleDestinationSelect}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          language: 'es',
        }}
        styles={{
          container: styles.autocompleteContainer,
          textInput: styles.autocompleteInput,
          listView: styles.autocompleteListView,
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={200}
      />
      <MapView
        style={styles.map}
        region={location}
        showsUserLocation={true}
        followUserLocation={true}
      >
        <Marker coordinate={location} />
        {destination && <Marker coordinate={destination} />}
        {destination && (
          <MapViewDirections
            origin={location}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="hotpink"
            onReady={handleRouteReady}
          />
        )}
        {route && <Polyline coordinates={route} strokeWidth={2} strokeColor="blue" />}
      </MapView>
      <View style={styles.bottomContainer}>
        {destination && userInfo && (
          <Button
            title="Seleccionar Viaje"
            onPress={() => navigation.navigate('TripDetails', {
              destination,
              autotanqueNumber: userInfo.autotanqueNumber,
              oatName: userInfo.name,
              tad: userInfo.tad
            })}
          />
        )}
      </View>
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
  autocompleteContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  autocompleteInput: {
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingLeft: 10,
  },
  autocompleteListView: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 60,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default HomeScreen;
