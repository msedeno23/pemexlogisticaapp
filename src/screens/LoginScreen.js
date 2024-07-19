import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { loginUser } from '../services/AuthService';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingrese su correo electrónico y contraseña.');
      return;
    }

    try {
      await loginUser(email, password);
      Alert.alert('Bienvenido');
      console.log('Vamos al inicio');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error al iniciar sesión', error.message);
      console.log('Error al iniciar sesión:', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background.webp')}
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={require('../assets/logopmx.png')}
            style={styles.logo}
          />
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Icon name="envelope" size={20} color="#fff" style={styles.icon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#fff"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#fff" style={styles.icon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#fff"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>¿No tienes una cuenta? Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  imageStyle: {
    resizeMode: 'cover',
    opacity: 0.8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',  // darker semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 242,
    height: 70.5,
    marginBottom: 32,
    resizeMode: 'contain',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    borderRadius: 5,
    marginBottom: 16,
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#1c1c1c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#fff',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#fff',
    marginBottom: 16,
  },
});

export default LoginScreen;
