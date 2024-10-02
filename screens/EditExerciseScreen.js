import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateExercise } from '../userFirestore';
import { auth } from '../firebaseConfig';

const EditExerciseScreen = ({ route, navigation }) => {
  const { exercise, routineId } = route.params;
  const userId = auth.currentUser.uid;
  const [instructionsVisible, setInstructionsVisible] = useState(false);
  const [sets, setSets] = useState(exercise.sets || [{ kgs: '', reps: '', sets: '', rest: 60 }]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddSet = () => {
    setSets([...sets, { kgs: '', reps: '', sets: '', rest: 60 }]);
  };

  const handleRestChange = (index, change) => {
    const newSets = [...sets];
    const newRest = newSets[index].rest + change;
    newSets[index].rest = Math.max(0, newRest);
    setSets(newSets);
  };

  const handleInputChange = (index, field, value) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const handleRemoveSet = (index) => {
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  };

  const validateSets = () => {
    return sets.every(set => set.kgs && set.reps && set.sets);
  };

  const handleSave = async () => {
    if (!validateSets()) {
      setModalVisible(true);
      return;
    }

    try {
      await updateExercise(userId, routineId, exercise.id, { name: exercise.name, sets });
      Alert.alert('Success', 'Exercise updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update exercise.');
      console.error(error);
    }
  };

  const handleConfirmSave = async () => {
    const updatedSets = sets.map(set => ({
      kgs: set.kgs || '0',
      reps: set.reps || '0',
      sets: set.sets || '0',
      rest: set.rest,
    }));
    
    setSets(updatedSets);
    setModalVisible(false);

    try {
      await updateExercise(routineId, exercise.id, { name: exercise.name, sets: updatedSets });
      Alert.alert('Success', 'Exercise updated successfully!');
      navigation.goBack(); 
    } catch (error) {
      Alert.alert('Error', 'Failed to update exercise.');
      console.error(error);
    }
  };

  const handleCancelSave = () => {
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.exerciseDetails}>{`${exercise.type} • ${exercise.muscle} • ${exercise.equipment}`}</Text>

        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => setInstructionsVisible(!instructionsVisible)}
        >
          <Text style={styles.dropdownHeaderText}>Instructions</Text>
          <Ionicons name={instructionsVisible ? 'caret-up-outline' : 'caret-down-outline'} size={24} color="#F9BA31" />
        </TouchableOpacity>

        {instructionsVisible && (
          <Text style={styles.instructionsText}>{exercise.instructions}</Text>
        )}

        {sets.map((set, index) => (
          <View key={index} style={styles.setContainer}>
            <View style={styles.inputRow}>
              <View style={styles.leftInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="kgs"
                  keyboardType="numeric"
                  value={set.kgs}
                  onChangeText={(text) => handleInputChange(index, 'kgs', text)}
                />
                <Text style={styles.unit}>kgs</Text>
              </View>
              <View style={styles.centerInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="reps"
                  keyboardType="numeric"
                  value={set.reps}
                  onChangeText={(text) => handleInputChange(index, 'reps', text)}
                />
                <Text style={styles.unit}>reps</Text>
              </View>
              <View style={styles.rightInputContainer}>
                <Text style={styles.unit}>x</Text>
                <TextInput
                  style={[styles.input, styles.setInput]}
                  placeholder="sets"
                  keyboardType="numeric"
                  value={set.sets}
                  onChangeText={(text) => handleInputChange(index, 'sets', text)}
                />
              </View>
              <TouchableOpacity onPress={() => handleRemoveSet(index)} style={styles.removeButton}>
                <Ionicons name="trash" size={24} color="#F9BA31" />
              </TouchableOpacity>
            </View>

            <View style={styles.restRow}>
              <TouchableOpacity onPress={() => handleRestChange(index, -10)} style={styles.restButton}>
                <Ionicons name="remove" size={28} color="gray" />
              </TouchableOpacity>
              <TextInput
                style={styles.restInput}
                value={String(set.rest)}
                editable={false}
              />
              <Text style={styles.unit}>secs</Text>
              <TouchableOpacity onPress={() => handleRestChange(index, 10)} style={styles.restButton}>
                <Ionicons name="add" size={28} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddSet}>
          <Text style={styles.addButtonText}>Add Set</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Exercise</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={handleCancelSave}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Incomplete Fields</Text>
            <Text style={styles.modalText}>You have not entered kgs, reps, or sets for some of the sets. Do you still want to save? The missing values will be set to 0.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleCancelSave} style={[styles.modalButton, styles.modalCancelButton]}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmSave} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    scrollContainer: {
      padding: 20,
      paddingBottom: 50,
    },
    exerciseImage: {
      width: 300,
      height: 300,
      alignSelf: 'center',
      marginBottom: 20,
    },
    exerciseName: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#F9BA31',
      marginBottom: 5,
    },
    exerciseDetails: {
      fontSize: 18,
      textAlign: 'center',
      color: 'gray',
      marginBottom: 25,
    },
    dropdownHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    dropdownHeaderText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#F9BA31',
    },
    instructionsText: {
      fontSize: 16,
      padding: 10,
      borderRadius: 5,
      marginBottom: 30,
    },
    setContainer: {
      marginVertical: 5,
    },
    removeButton: {
      marginHorizontal: 10,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flex: 1,
    },
    centerInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    rightInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flex: 1,
    },
    input: {
      padding: 5,
      fontSize: 20,
      color: 'gray',
      fontWeight: 'bold',
      textAlign: 'right',
      minWidth: 30,
      maxWidth: 100,
      alignSelf: 'flex-start',
    },
    setInput: {
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
    unit: {
      fontSize: 16,
      color: 'gray',
      marginLeft: 5,
    },
    setUnit: {
      marginStart: 10,
    },
    restRow: {
      flexDirection: 'row',
      color: 'gray',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      backgroundColor: 'whitesmoke',
      borderRadius: 10,
    },
    restButton: {
      padding: 10,
      color: 'gray',
    },
    restInput: {
      width: 60,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      padding: 10,
      marginHorizontal: 5,
      color: 'gray',
    },
    addButton: {
      backgroundColor: '#F9BA31',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    addButtonText: {
      fontSize: 18,
      color: 'white',
    },
    saveButton: {
      backgroundColor: '#F9BA31',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
    },
    saveButtonText: {
      fontSize: 18,
      color: 'white',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'gray',
    },
    modalText: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
      color: 'gray',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    modalButton: {
      backgroundColor: '#F9BA31',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      width: '48%',
    },
    modalCancelButton: {
      backgroundColor: 'gray',
    },
    modalButtonText: {
      fontSize: 16,
      color: 'white',
    },
  });

export default EditExerciseScreen;
