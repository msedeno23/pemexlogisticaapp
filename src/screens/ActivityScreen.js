import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { getUserTrips } from '../services/ActivityService';
import auth from '@react-native-firebase/auth';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ActivityScreen = () => {
  const [trips, setTrips] = useState([]);
  const [loginTime, setLoginTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userInfo, setUserInfo] = useState({ name: '' });
  const [abbreviatedDestinations, setAbbreviatedDestinations] = useState({});

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const tripsData = await getUserTrips();
        setTrips(tripsData);
        if (tripsData.length > 0) {
          setUserInfo(tripsData[0].userInfo);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
        Alert.alert('Error', 'No se pudieron obtener los viajes.');
      }
    };

    fetchTrips();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []); // empty dependency array to run this effect only once

  useEffect(() => {
    const abbreviateDestinations = () => {
      const abbreviated = {};
      Object.keys(destinationsFrequency).forEach(dest => {
        if (dest.length > 15) {
          abbreviated[dest] = `${dest.slice(0, 15)}...`;
        } else {
          abbreviated[dest] = dest;
        }
      });
      setAbbreviatedDestinations(abbreviated);
    };

    abbreviateDestinations();
  }, [trips]); // dependency array to run this effect only when trips change

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

  const tripsPerDay = trips.reduce((acc, trip) => {
    const tripDate = new Date(trip.startTime).toLocaleDateString();
    if (!acc[tripDate]) {
      acc[tripDate] = 0;
    }
    acc[tripDate] += 1;
    return acc;
  }, {});

  const destinationsFrequency = trips.reduce((acc, trip) => {
    const destination = trip.endLocation.description;
    if (!acc[destination]) {
      acc[destination] = 0;
    }
    acc[destination] += 1;
    return acc;
  }, {});

  const chartDataTripsPerDay = {
    labels: Object.keys(tripsPerDay).reverse(),
    datasets: [
      {
        data: Object.values(tripsPerDay).reverse(),
      },
    ],
  };

  const chartDataDestinations = {
    labels: Object.values(abbreviatedDestinations).slice(0, 5), // Show top 5 abbreviated destinations
    datasets: [
      {
        data: Object.values(destinationsFrequency).slice(0, 5),
      },
    ],
  };

  const handleBarPress = (index) => {
    const fullDestination = Object.keys(destinationsFrequency)[index];
    Alert.alert('Destino Completo', fullDestination);
  };

  const sections = [
    { title: 'Información General del OAT', data: [userInfo] },
    { title: 'Estadísticas del Día', data: [{ totalTrips: tripsToday.length, chartDataTripsPerDay }] },
    { title: 'Destinos Más Frecuentados', data: [{ chartDataDestinations }] },
    { title: 'Historial de Viajes del Día', data: tripsToday },
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item, section }) => {
        if (section.title === 'Información General del OAT') {
          return (
            <View>
              <Text style={styles.infoText}>Nombre del OAT: {item.name}</Text>
              <Text style={styles.infoText}>Hora de Entrada: {loginTime.toLocaleTimeString()}</Text>
              <Text style={styles.infoText}>Tiempo Trabajado: {calculateWorkingTime()}</Text>
            </View>
          );
        } else if (section.title === 'Estadísticas del Día') {
          return (
            <View>
              <Text style={styles.infoText}>Viajes Realizados: {item.totalTrips}</Text>
              {item.chartDataTripsPerDay.labels.length > 0 && (
                <LineChart
                  data={item.chartDataTripsPerDay}
                  width={screenWidth - 32}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                      stroke: '#ffa726',
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              )}
            </View>
          );
        } else if (section.title === 'Destinos Más Frecuentados') {
          return (
            <View>
              {item.chartDataDestinations.labels.length > 0 && (
                <BarChart
                  data={item.chartDataDestinations}
                  width={screenWidth - 32}
                  height={220}
                  fromZero={true}
                  chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#43a047',
                    backgroundGradientTo: '#66bb6a',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  onDataPointClick={({ index }) => handleBarPress(index)}
                />
              )}
            </View>
          );
        } else if (section.title === 'Historial de Viajes del Día') {
          return (
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
        }
      }}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.title}>{title}</Text>
      )}
      ListEmptyComponent={<Text style={styles.infoText}>No hay viajes realizados hoy.</Text>}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginBottom: 16,
  },
  tripText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default ActivityScreen;
