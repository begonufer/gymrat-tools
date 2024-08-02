import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';

const ExerciseBrowser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState([
    { id: '1', name: 'Push Up' },
    { id: '2', name: 'Squat' },
    { id: '3', name: 'Deadlift' },
    { id: '4', name: 'RDL' },
    { id: '5', name: 'Curl' },
  ]);

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar ejercicios..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.exerciseItem}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  input: {
    marginBottom: 20,
    color: 'grey',
    fontSize: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FAF3E4',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 10,
  },
  exerciseItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default ExerciseBrowser;
