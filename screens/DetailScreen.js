import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

const DetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Name</Text>
      <Text style={styles.detail}>Grupo muscular:</Text>
      <Text style={styles.detail}>Equipo:</Text>
      <Text style={styles.detail}>Descripción: </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  detail: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default DetailScreen;
