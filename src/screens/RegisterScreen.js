import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { registerUser } from '../services/AuthService';
import { Picker } from '@react-native-picker/picker';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [lastNameP, setLastNameP] = useState('');
  const [lastNameM, setLastNameM] = useState('');
  const [tad, setTad] = useState('');
  const [ficha, setFicha] = useState('');
  const [autotanque, setAutotanque] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      await registerUser(email, password, {
        name,
        lastNameP,
        lastNameM,
        tad,
        ficha,
        autotanque,
      });
      Alert.alert('Registration Successful');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Input placeholder="Nombre(s)" value={name} onChangeText={setName} />
      <Input placeholder="Apellido Paterno" value={lastNameP} onChangeText={setLastNameP} />
      <Input placeholder="Apellido Materno" value={lastNameM} onChangeText={setLastNameM} />
      <Picker
        selectedValue={tad}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setTad(itemValue)}
      >
        <Picker.Item label="Seleccione TAD" value="" />
        <Picker.Item label="TAD Veracruz" value="TAD Veracruz" />
        <Picker.Item label="TAD Escamela" value="TAD Escamela" />
      </Picker>
      <Input placeholder="Ficha" value={ficha} onChangeText={setFicha} />
      <Input placeholder="Autotanque" value={autotanque} onChangeText={setAutotanque} />
      <Input placeholder="Correo" value={email} onChangeText={setEmail} />
      <Input placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <Input
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
});

export default RegisterScreen;
