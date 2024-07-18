import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { autotanqueNumber, oatName, tad } = route.params;
  const [destination, setDestination] = useState(null);

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="¿A dónde vamos?"
        onPress={(data, details = null) => {
          const { lat, lng } = details.geometry.location;
          setDestination({
            latitude: lat,
            longitude: lng,
            name: data.description,
          });
        }}
        query={{
          key: 'AIzaSyAvXIU0Bf7rtYVDPqB8C-g4frItTBJ9Fqk',
          language: 'es',
        }}
        styles={{
          textInput: styles.input,
        }}
        fetchDetails={true}
      />
      <ScrollView style={styles.suggestions}>
        <Text style={styles.suggestionTitle}>Sugerencias</Text>
        <View style={styles.suggestionContainer}>
          <TouchableOpacity style={styles.suggestion}>
            <Text>Ride</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.suggestion}>
            <Text>Package</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.suggestion}>
            <Text>Reserve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.suggestion}>
            <Text>Rent</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {destination && (
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('TripDetails', {
              destination,
              autotanqueNumber,
              oatName,
              tad,
            })
          }
        >
          <Text style={styles.buttonText}>Seleccionar Viaje</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  suggestions: {
    flex: 1,
    marginTop: 20,
  },
  suggestionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  suggestionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  suggestion: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '22%',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default HomeScreen;
