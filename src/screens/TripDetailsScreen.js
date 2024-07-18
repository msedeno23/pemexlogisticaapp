import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import firestore from '@react-native-firebase/firestore';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAvXIU0Bf7rtYVDPqB8C-g4frItTBJ9Fqk';

const TripDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { destination, autotanqueNumber, oatName, tad } = route.params;
  const [startTime, setStartTime] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState('00:00:00');
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    let watchId;
    if (tracking) {
      const start = new Date();
      setStartTime(start);

      watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { latitude, longitude };
          setCurrentLocation(newLocation);

          if (currentLocation) {
            const distance = calculateDistance(currentLocation, newLocation);
            setDistanceTraveled(prevDistance => prevDistance + distance);
          }

          const elapsed = new Date() - start;
          setTimeElapsed(formatTime(elapsed));

          setRouteCoordinates(prevCoordinates => [...prevCoordinates, newLocation]);
        },
        (error) => Alert.alert('Error', error.message),
        { enableHighAccuracy: true, distanceFilter: 0 }
      );

      // Update timer every second
      const intervalId = setInterval(() => {
        const elapsed = new Date() - start;
        setTimeElapsed(formatTime(elapsed));
      }, 1000);

      setTimer(intervalId);
    }

    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [tracking, currentLocation]);

  const calculateDistance = (start, end) => {
    if (!start) return 0;
    const radlat1 = Math.PI * start.latitude / 180;
    const radlat2 = Math.PI * end.latitude / 180;
    const theta = start.longitude - end.longitude;
    const radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) dist = 1;
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344; // in km
    return dist;
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleStartTrip = () => {
    setTracking(true);
  };

  const handleEndTrip = async () => {
    setTracking(false);
    const endTime = new Date();
    const tripDuration = (endTime - startTime) / 1000; // in seconds

    await firestore().collection('trips').add({
      autotanqueNumber,
      oatName,
      tad,
      startLocation: currentLocation,
      endLocation: destination,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      tripDuration,
      distanceTraveled,
    });

    Alert.alert('Viaje Finalizado', `Duración: ${formatTime(tripDuration * 1000)}, Distancia: ${distanceTraveled.toFixed(2)} km`);
    navigation.navigate('Home');
  };

  const mapRegion = {
    latitude: currentLocation ? currentLocation.latitude : destination.latitude,
    longitude: currentLocation ? currentLocation.longitude : destination.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        followUserLocation={true}
      >
        {currentLocation && <Marker coordinate={currentLocation} />}
        {destination && <Marker coordinate={destination} />}
        {destination && currentLocation && (
          <MapViewDirections
            origin={currentLocation}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="hotpink"
            onError={(errorMessage) => {
              Alert.alert('Error', errorMessage);
            }}
          />
        )}
        {routeCoordinates.length > 0 && <Polyline coordinates={routeCoordinates} strokeWidth={2} strokeColor="blue" />}
      </MapView>
      <ScrollView style={styles.detailsContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Detalles del Viaje</Text>
          <Text style={styles.text}>Número del Autotanque: {autotanqueNumber}</Text>
          <Text style={styles.text}>Nombre del OAT: {oatName}</Text>
          <Text style={styles.text}>Pertenece a: {tad}</Text>
          <Text style={styles.text}>Destino: {destination.name}</Text>
          <Text style={styles.text}>Hora Actual: {new Date().toLocaleTimeString()}</Text>
          {tracking && (
            <>
              <Text style={styles.text}>Tiempo Transcurrido: {timeElapsed}</Text>
              <Text style={styles.text}>Distancia Recorrida: {distanceTraveled.toFixed(2)} km</Text>
            </>
          )}
          {!tracking ? (
            <TouchableOpacity style={styles.button} onPress={handleStartTrip}>
              <Text style={styles.buttonText}>Iniciar Viaje</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleEndTrip}>
              <Text style={styles.buttonText}>Finalizar Viaje</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 2,
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 3,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default TripDetailsScreen;
