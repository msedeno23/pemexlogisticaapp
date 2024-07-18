import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const TripSummaryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tripDuration, distanceTraveled } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen del Viaje</Text>
      <Text style={styles.text}>Duración del viaje: {tripDuration} segundos</Text>
      <Text style={styles.text}>Distancia recorrida: {distanceTraveled.toFixed(2)} km</Text>
      <Button title="Volver al inicio" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default TripSummaryScreen;
