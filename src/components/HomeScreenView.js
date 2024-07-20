import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import MapView, { Marker, Polyline } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreenView = ({
  location,
  destination,
  route,
  history,
  userInfo,
  navigationActive,
  showTripDetails,
  estimatedTime,
  onSearchSelect,
  onRouteReady,
  onStartTrip,
  onEndTrip,
  GOOGLE_MAPS_APIKEY,
}) => {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Buscar destino..."
        minLength={2}
        fetchDetails={true}
        onPress={onSearchSelect}
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
        showsUserLocation={false}
      >
        <Marker
          coordinate={location}
          title="Tu ubicación"
        >
          <Image
            source={require('../assets/Autotanque.png')}
            style={styles.markerIcon}
          />
        </Marker>
        {destination && <Marker coordinate={destination} />}
        {destination && (
          <MapViewDirections
            origin={location}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="hotpink"
            onReady={onRouteReady}
          />
        )}
        {route.length > 0 && <Polyline coordinates={route} strokeWidth={2} strokeColor="blue" />}
      </MapView>
      {!navigationActive && (
        <View style={styles.tripDetails}>
          <Text style={styles.tripText}>Seleccionar un destino para iniciar el viaje</Text>
          {showTripDetails && (
            <>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsText}>Destino: {destination.description}</Text>
                <Text style={styles.detailsText}>Tiempo Estimado: {estimatedTime}</Text>
                <Text style={styles.detailsText}>Número de Autotanque: {userInfo.autotanqueNumber}</Text>
                <Text style={styles.detailsText}>Capacidad: {userInfo.capacity}</Text>
                <Text style={styles.detailsText}>Nombre del OAT: {userInfo.name}</Text>
                <Text style={styles.detailsText}>TAD: {userInfo.tad}</Text>
              </View>
              <TouchableOpacity style={[styles.button, styles.startTripButton]} onPress={onStartTrip}>
                <Text style={styles.buttonText}>Iniciar Viaje</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
      {navigationActive && (
        <TouchableOpacity style={[styles.button, styles.endTripButton]} onPress={onEndTrip}>
          <Text style={styles.buttonText}>Finalizar Viaje</Text>
        </TouchableOpacity>
      )}
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
  tripDetails: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  tripText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  detailsContainer: {
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 14,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  startTripButton: {
    backgroundColor: '#000000',
  },
  endTripButton: {
    backgroundColor: '#d9534f',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  markerIcon: {
    width: 30,
    height: 40,
    resizeMode: 'contain',
  },
});

export default HomeScreenView;
