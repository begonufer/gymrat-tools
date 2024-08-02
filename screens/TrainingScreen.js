import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

const TrainingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTraining')}>
        <Text style={styles.addButtonText}>Add training</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.rectangle} onPress={() => navigation.navigate('Detail')}>
        <Text style={styles.rectangleText}>Training 1</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  addButton: {
    backgroundColor: '#F9BA31',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  rectangle: {
    backgroundColor: '#F9BA31',
    height: 200,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  rectangleText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TrainingScreen;
