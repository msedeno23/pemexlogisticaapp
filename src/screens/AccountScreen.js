import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const AccountScreen = ({ navigation }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth().currentUser;
      if (user) {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          setUserInfo(userDoc.data());
          if (userDoc.data().profilePhoto) {
            setProfilePhoto(userDoc.data().profilePhoto);
          }
        }
      }
    };
    fetchUserInfo();
  }, []);

  const choosePhoto = () => {
    launchImageLibrary({}, async (response) => {
      if (response.assets) {
        const source = response.assets[0].uri;
        setProfilePhoto(source);

        // Upload image to Firebase Storage and update user document
        const user = auth().currentUser;
        if (user) {
          const storageRef = storage().ref(`profilePhotos/${user.uid}`);
          await storageRef.putFile(source);
          const photoURL = await storageRef.getDownloadURL();

          await firestore().collection('users').doc(user.uid).update({
            profilePhoto: photoURL,
          });

          setProfilePhoto(photoURL);
        }
      }
    });
  };

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Icon name="times" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userInfo?.name}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={20} color="#000" />
            <Text style={styles.rating}>4.57</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.profilePhotoContainer} onPress={choosePhoto}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
          ) : (
            <Icon name="user" size={50} color="#ddd" />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="life-ring" size={24} color="#000" />
          <Text style={styles.actionText}>Ayuda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="credit-card" size={24} color="#000" />
          <Text style={styles.actionText}>Pago</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Activity')}>
          <Icon name="bookmark" size={24} color="#000" />
          <Text style={styles.actionText}>Actividad</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.promoContainer}>
        <Text style={styles.promoTitle}>Pemex Logística</Text>
        <Text style={styles.promoText}>Optimización del transporte de combustible a través de soluciones logísticas eficientes.</Text>
      </View>
      <View style={styles.promoContainer}>
        <Text style={styles.promoTitle}>Objetivo de la App</Text>
        <Text style={styles.promoText}>Facilitar la gestión y seguimiento de rutas de transporte de combustible en tiempo real.</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 18,
    marginLeft: 4,
  },
  profilePhotoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  profilePhoto: {
    width: 80,
    height: 80,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionText: {
    marginTop: 8,
    fontSize: 16,
  },
  promoContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 16,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  promoText: {
    marginTop: 4,
    fontSize: 14,
  },
  logoutButton: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#d9534f',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccountScreen;
