import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { registerUser } from '../services/AuthService';
import Icon from 'react-native-vector-icons/FontAwesome';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [lastNameP, setLastNameP] = useState('');
  const [lastNameM, setLastNameM] = useState('');
  const [dob, setDob] = useState('');
  const [tad, setTad] = useState('');
  const [ficha, setFicha] = useState('');
  const [autotanqueNumber, setAutotanqueNumber] = useState('');
  const [capacity, setCapacity] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !name || !lastNameP || !lastNameM || !dob || !tad || !ficha || !autotanqueNumber || !capacity) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      await registerUser(email, password, {
        name,
        lastNameP,
        lastNameM,
        dob,
        tad,
        ficha,
        autotanqueNumber,
        capacity,
      });
      Alert.alert('Registro Exitoso');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error al Registrar', error.message);
    }
  };

  const handleDobChange = (text) => {
    if (text.length === 2 || text.length === 5) {
      setDob(text + '/');
    } else {
      setDob(text);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background.webp')}
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Registro OAT</Text>
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Icon name="user" size={20} color="#fff" style={styles.icon} />
                <TextInput
                  placeholder="Nombre(s)"
                  placeholderTextColor="#fff"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="user" size={20} color="#fff" style={styles.icon} />
                <TextInput
                  placeholder="Apellido Paterno"
                  placeholderTextColor="#fff"
                  value={lastNameP}
                  onChangeText={setLastNameP}
                  style={styles.input}
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="user" size={20} color="#fff" style={styles.icon} />
                <TextInput
                  placeholder="Apellido Materno"
                  placeholderTextColor="#fff"
                  value={lastNameM}
                  onChangeText={setLastNameM}
                  style={styles.input}
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="calendar" size={20} color="#fff" style={styles.icon} />
                <TextInput
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#fff"
                  value={dob}
                  onChangeText={handleDobChange}
                  style={styles.input}
                  maxLength={10}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tad}
                  style={styles.picker}
                  onValueChange={(itemValue, itemIndex) => setTad(itemValue)}
                >
                  <Picker.Item label="Seleccione TAD" value="" />
                  <Picker.Item label="TAD Veracruz" value="TAD Veracruz" />
                  <Picker.Item label="TAD Escamela" value="TAD Escamela" />
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Icon name="id-badge" size={20} color="#fff" style={styles.icon} />
                <TextInput
                  placeholder="Ficha"
                  placeholderTextColor="#fff"
                  value={ficha}
                  onChangeText={setFicha}
                  style={styles.input}
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="truck" size={20} color="#fff" style={styles.icon} />
                <TextInput
                  placeholder="Número de Autotanque"
                  placeholderTextColor="#fff"
                  value={autotanqueNumber}
                  onChangeText={setAutotanqueNumber}
                  style={styles.input}
                />
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={capacity}
                  style={styles.picker}
                  onValueChange={(itemValue, itemIndex) => setCapacity(itemValue)}
                >
                  <Picker.Item label="Seleccione Capacidad de Autotanque" value="" />
                  <Picker.Item label="20 mil litros" value="20 mil litros" />
                  <Picker.Item label="30 mil litros" value="31.5 mil litros" />
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Icon name="envelope" size={20} color="#fff" style={styles.icon} />
                <TextInput
                  placeholder="Correo"
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
                  placeholder="Contraseña"
                  placeholderTextColor="#fff"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#fff" style={styles.icon} />
                <TextInput
                  placeholder="Confirmar Contraseña"
                  placeholderTextColor="#fff"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrar OAT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  container: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
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
  pickerContainer: {
    backgroundColor: '#1c1c1c',
    borderRadius: 5,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#fff',
  },
  picker: {
    color: '#fff',
    height: 50,
    width: '100%',
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
});

export default RegisterScreen;
