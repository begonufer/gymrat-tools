import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { storeUserInfo } from '../userFirestore';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const initialUserInfo = {
          email: user.email,
          password: password,
          birthdate: '',
          sex: '',
          height: '',
          weight: '',
          units: '',
        };
        storeUserInfo(user.uid, initialUserInfo);
        navigation.replace('Home');
      })
      .catch(error => {
        console.error(error);
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/GymRatLogo.png')} style={styles.logo} />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <Text style={styles.accountText} >Have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.registerText}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
    color: 'grey',
    fontSize: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FAF3E4',
  },
  button: {
    backgroundColor: '#F9BA31',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  accountText: {
    color: 'grey',
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  registerText: {
    color: '#F9BA31',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
