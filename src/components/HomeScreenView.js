import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import Modal from 'react-native-modal';

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
      <MapView
        style={styles.map}
        region={location}
        showsUserLocation={false} // Desactivamos la ubicación del usuario para usar un marcador personalizado
        followUserLocation={true}
      >
        <Marker coordinate={location}>
          <Image source={require('../assets/2555001.png')} style={styles.carIcon} />
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
        {route.length > 0 && <Polyline coordinates={route} strokeWidth={3} strokeColor="blue" />}
      </MapView>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <Icon name="bars" size={30} color="#fff" />
      </TouchableOpacity>
      {!navigationActive && (
        <View style={styles.header}>
          <Text style={styles.greeting}>Buen día, {userInfo?.name || 'User'}¿a dónde vamos?</Text>
          <GooglePlacesAutocomplete
            placeholder="Where to?"
            minLength={2}
            fetchDetails={true}
            onPress={onSearchSelect}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: 'en',
            }}
            styles={{
              container: styles.searchContainer,
              textInput: styles.searchInput,
              textInputContainer: styles.textInputContainer,
              listView: styles.listView,
              description: styles.description,
              predefinedPlacesDescription: styles.predefinedPlacesDescription,
            }}
          />
          <FlatList
            data={history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.favoriteItem}>
                <Icon name="map-marker" size={20} color="#fff" />
                <View style={styles.favoriteText}>
                  <Text style={styles.favoriteTitle}>{item.address}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <View style={styles.footer}>
        {showTripDetails && (
          <Modal
            isVisible={showTripDetails}
            onBackdropPress={() => setShowTripDetails(false)}
            style={styles.modal}
          >
            <View style={styles.modalContent}>
              <Image source={{ uri: 'https://link-to-your-truck-image.png' }} style={styles.truckImage} />
              <View style={styles.modalInfo}>
                <View style={styles.infoRow}>
                  <Icon name="truck" size={20} color="#000" />
                  <Text style={styles.modalText}>Número de Autotanque: {userInfo?.autotanqueNumber}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="tint" size={20} color="#000" />
                  <Text style={styles.modalText}>Capacidad: {userInfo?.capacity}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="clock-o" size={20} color="#000" />
                  <Text style={styles.modalText}>Hora Estimada de Llegada: {estimatedTime}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="user" size={20} color="#000" />
                  <Text style={styles.modalText}>Nombre del OAT: {userInfo?.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="building-o" size={20} color="#000" />
                  <Text style={styles.modalText}>Pertenece a: {userInfo?.tad}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.startButton} onPress={onStartTrip}>
                <Text style={styles.startButtonText}>Iniciar Viaje</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
        {navigationActive && (
          <TouchableOpacity style={styles.endButton} onPress={onEndTrip}>
            <Text style={styles.endButtonText}>Finalizar Viaje</Text>
          </TouchableOpacity>
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
  carIcon: {
    width: 50,
    height: 50,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  header: {
    position: 'absolute',
    top: 80,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    zIndex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchContainer: {
    zIndex: 1,
  },
  textInputContainer: {
    backgroundColor: '#1c1c1c',
    borderRadius: 5,
  },
  searchInput: {
    backgroundColor: '#1c1c1c',
    color: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  listView: {
    backgroundColor: '#1c1c1c',
  },
  description: {
    color: '#000',
  },
  predefinedPlacesDescription: {
    color: '#fff',
  },
  favorites: {
    marginBottom: 10,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    elevation: 3,
  },
  favoriteText: {
    marginLeft: 10,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  truckImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  modalInfo: {
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000', // Asegúrate de que el texto sea visible
  },
  startButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  endButton: {
    backgroundColor: '#ff0000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  endButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreenView;
