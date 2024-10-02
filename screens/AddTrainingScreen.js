import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getUserInfo, storeRoutine } from '../userFirestore';
import { auth } from '../firebaseConfig';

const AddTrainingScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState(''); 

  const user = auth.currentUser;

  const handleSaveRoutine = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a routine name.');
      return;
    }

    if (notes.length > 250) {
      Alert.alert('Validation Error', 'Notes cannot exceed 250 characters.');
      return;
    }

    try {
      const userId = user.uid;
      const routine = { name, notes };

      const routineId = await storeRoutine(userId, routine);

      Alert.alert('Success', 'Routine saved successfully!');
      setName('');
      setNotes('');
      navigation.navigate('AddRoutine', { routineId }); 
    } catch (error) {
      console.error('Error saving routine: ', error);
      Alert.alert('Error', 'Failed to save routine.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Routine name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Notes"
        style={[styles.input, styles.notesInput]}
        value={notes}
        onChangeText={text => setNotes(text.slice(0, 250))}
        multiline={true}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleSaveRoutine}>
        <Text style={styles.addButtonText}>Save routine</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  input: {
    marginBottom: 20,
    color: 'grey',
    fontSize: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FAF3E4',
  },
  notesInput: {
    height: 100, 
    textAlignVertical: 'top',
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
});

export default AddTrainingScreen;
