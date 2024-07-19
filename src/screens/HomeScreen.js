import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, Alert, Button } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import HomeScreenView from '../components/HomeScreenView';
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAvXIU0Bf7rtYVDPqB8C-g4frItTBJ9Fqk';

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [navigationActive, setNavigationActive] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [showTripDetails, setShowTripDetails] = useState(false);

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

    const fetchHistory = async () => {
      const user = auth().currentUser;
      if (user) {
        const historyDocs = await firestore().collection('history').where('userId', '==', user.uid).orderBy('timestamp', 'desc').limit(2).get();
        const historyData = historyDocs.docs.map(doc => doc.data());
        setHistory(historyData);
      }
    };

    requestLocationPermission();
    fetchUserInfo();
    fetchHistory();
  }, []);

  const handleSearchSelect = async (data, details) => {
    const user = auth().currentUser;
    if (user && details) {
      const { lat, lng } = details.geometry.location;
      setDestination({
        latitude: lat,
        longitude: lng,
        description: data.description,
      });
      const newHistoryItem = {
        userId: user.uid,
        address: data.description,
        latitude: lat,
        longitude: lng,
        timestamp: new Date().toISOString()
      };
      await firestore().collection('history').add(newHistoryItem);
      setHistory(prevHistory => [newHistoryItem, ...prevHistory].slice(0, 2));
      setShowTripDetails(true);
    }
  };

  const handleRouteReady = (result) => {
    setRoute(result.coordinates);
    if (result.duration) {
      setEstimatedTime(`${Math.round(result.duration)} min`);
    }
  };

  const handleStartTrip = async () => {
    const user = auth().currentUser;
    if (user && destination) {
      await firestore().collection('trips').add({
        userId: user.uid,
        startLocation: location,
        endLocation: destination,
        startTime: new Date().toISOString(),
        userInfo: userInfo,
      });
      setNavigationActive(true);
      setShowTripDetails(false);
    }
  };

  const handleEndTrip = async () => {
    Alert.alert(
      "Finalizar Viaje",
      "¿Está seguro de que desea finalizar el viaje?",
      [
        {
          text: "No",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Sí",
          onPress: async () => {
            const user = auth().currentUser;
            if (user && destination) {
              try {
                const tripDoc = await firestore().collection('trips').where('userId', '==', user.uid).orderBy('startTime', 'desc').limit(1).get();
                if (!tripDoc.empty) {
                  const trip = tripDoc.docs[0];
                  await firestore().collection('trips').doc(trip.id).update({
                    endTime: new Date().toISOString(),
                  });
                }
                setNavigationActive(false);
                setDestination(null);
                setRoute([]);
              } catch (error) {
                Alert.alert('Error', error.message);
              }
            }
          }
        }
      ]
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Icon.Button
          name="menu"
          size={25}
          backgroundColor="#000"
          color="#fff" // Cambia esto al color que desees, por ejemplo, "#000" para negro
          onPress={() => navigation.openDrawer()}
        />
      ),
      headerTitle: '',
      headerShown: true,
    });
  }, [navigation]);

  return (
    <HomeScreenView
      location={location}
      destination={destination}
      route={route}
      userInfo={userInfo}
      history={history}
      navigationActive={navigationActive}
      showTripDetails={showTripDetails}
      estimatedTime={estimatedTime}
      onSearchSelect={handleSearchSelect}
      onRouteReady={handleRouteReady}
      onStartTrip={handleStartTrip}
      onEndTrip={handleEndTrip}
      GOOGLE_MAPS_APIKEY={GOOGLE_MAPS_APIKEY}
    />
  );
};

export default HomeScreen;
