// src/screens/AnimatedSplashScreen.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import SplashScreen from 'react-native-splash-screen';

const AnimatedSplashScreen = ({ navigation }) => {
  const logoOpacity = new Animated.Value(0);

  useEffect(() => {
    SplashScreen.hide();
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {
      setTimeout(() => {
        navigation.navigate('Home');
      }, 1500);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: logoOpacity }}>
        <Image
          source={require('../assets/logopmx2.png')}
          style={styles.logo}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 242,
    height: 70.5,
    resizeMode: 'contain',
  },
});

export default AnimatedSplashScreen;
