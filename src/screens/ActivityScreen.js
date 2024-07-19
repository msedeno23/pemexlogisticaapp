import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getUserTrips } from '../services/ActivityService';
import auth from '@react-native-firebase/auth';

const ActivityScreen = () => {
  const [trips, setTrips] = useState([]);
  const [loginTime, setLoginTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchTrips = async () => {
      const tripsData = await getUserTrips();
      setTrips(tripsData);
    };

    fetchTrips();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderTrip = ({ item }) => (
    <View style={styles.tripContainer}>
      <Text style={styles.tripText}>Destino: {item.endLocation.description}</Text>
      <Text style={styles.tripText}>Hora de Inicio: {new Date(item.startTime).toLocaleTimeString()}</Text>
      <Text style={styles.tripText}>Hora de Fin: {item.endTime ? new Date(item.endTime).toLocaleTimeString() : 'En curso'}</Text>
      <Text style={styles.tripText}>Número de Autotanque: {item.userInfo.autotanqueNumber}</Text>
      <Text style={styles.tripText}>Capacidad: {item.userInfo.capacity}</Text>
      <Text style={styles.tripText}>Nombre del OAT: {item.userInfo.name}</Text>
      <Text style={styles.tripText}>TAD: {item.userInfo.tad}</Text>
    </View>
  );

  const calculateWorkingTime = () => {
    const diff = currentTime - loginTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const tripsToday = trips.filter(trip => {
    const tripDate = new Date(trip.startTime);
    const today = new Date();
    return (
      tripDate.getDate() === today.getDate() &&
      tripDate.getMonth() === today.getMonth() &&
      tripDate.getFullYear() === today.getFullYear()
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actividad del Día</Text>
      <Text style={styles.infoText}>Hora de Entrada: {loginTime.toLocaleTimeString()}</Text>
      <Text style={styles.infoText}>Tiempo Trabajado: {calculateWorkingTime()}</Text>
      <Text style={styles.infoText}>Viajes Realizados: {tripsToday.length}</Text>
      <FlatList
        data={tripsToday}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.infoText}>No hay viajes realizados hoy.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  tripContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  tripText: {
    fontSize: 14,
  },
});

export default ActivityScreen;
