import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.replace('Home');
      })
      .catch(error => {
        console.error(error);
        alert(error.message);
      });
  };

  const handlePasswordReset = () => {
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          Alert.alert('Password Reset', 'Check your email to reset your password.');
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Error', error.message);
        });
    } else {
      Alert.alert('Enter Email', 'Please enter your email address to reset your password.');
    }
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePasswordReset} style={styles.registerContainer}>
        <Text style={styles.registerText}>Forgot your password?</Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <Text style={styles.accountText} >Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>Create an account</Text>
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

export default LoginScreen;
