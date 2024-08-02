import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ExerciseBrowser from '../components/ExerciseBrowser';

const AddTrainingScreen = () => {
  return (
    <View style={styles.container}>
      <ExerciseBrowser />
      <View style={styles.rectangle}>
        <Text style={styles.rectangleText}>Rectángulo</Text>
      </View>
      <View style={styles.rectangle}>
        <Text style={styles.rectangleText}>Rectángulo</Text>
      </View>
      <View style={styles.rectangle}>
        <Text style={styles.rectangleText}>Rectángulo</Text>
      </View>
      <View style={styles.rectangle}>
        <Text style={styles.rectangleText}>Rectángulo</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  rectangle: {
    backgroundColor: '#F9BA31',
    width: '100%',
    height: 50,
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangleText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddTrainingScreen;
