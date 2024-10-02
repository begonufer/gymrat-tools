import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput, Alert, Modal } from 'react-native';
import { getRoutine, getExercises, updateRoutineName, deleteRoutine, updateExercisePosition } from '../userFirestore';
import { auth } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import DraggableFlatList from 'react-native-draggable-flatlist';

const AddRoutineScreen = ({ route, navigation }) => {
  const { routineId } = route.params;
  const [exercises, setExercises] = useState([]);
  const [routineName, setRoutineName] = useState('');
  const [editRoutineName, setEditRoutineName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const user = auth.currentUser;

  const fetchRoutineAndExercises = useCallback(() => {
    const fetchData = async () => {
      try {
        const userId = user.uid;
        const routine = await getRoutine(userId, routineId);
        if (routine) {
          setRoutineName(routine.name);
          setEditRoutineName(routine.name);
        }
        
        const fetchedExercises = await getExercises(userId, routineId);
        setExercises(fetchedExercises);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching routine and exercises: ', error);
        Alert.alert('Error', 'Failed to fetch routine or exercises.');
      }
    };

    fetchData();
  }, [routineId, user.uid]);

  useFocusEffect(fetchRoutineAndExercises);

  const handleUpdateRoutineName = async () => {
    try {
      const userId = user.uid;
      await updateRoutineName(userId, routineId, editRoutineName);
      setRoutineName(editRoutineName);
      setIsEditingName(false);
      Alert.alert('Success', 'Routine name updated successfully!');
    } catch (error) {
      console.error('Error updating routine name: ', error);
      Alert.alert('Error', 'Failed to update routine name.');
    }
  };

  const handleDeleteRoutine = async () => {
    try {
      const userId = user.uid;
      await deleteRoutine(userId, routineId);
      setModalVisible(false);
      Alert.alert('Success', 'Routine deleted successfully!');
      navigation.navigate('Training', { refresh: true });
    } catch (error) {
      console.error('Error deleting routine: ', error);
      Alert.alert('Error', 'Failed to delete routine.');
    }
  };

  const handleDragEnd = async ({ data }) => {
    setExercises(data);

    data.forEach(async (exercise, index) => {
      try {
        await updateExercisePosition(user.uid, routineId, exercise.id, index);
      } catch (error) {
        console.error('Error updating exercise position:', error);
      }
    });
  };

  const renderExercise = ({ item, drag, isActive }) => (
    <TouchableOpacity
      style={[
        styles.exerciseItem,
        { backgroundColor: isActive ? '#ffe5ab' : 'whitesmoke' }
      ]}
      onLongPress={drag}
      delayLongPress={400}
      onPress={() => navigation.navigate('EditExercise', { exercise: item, routineId })}
    >
      <Text style={styles.exerciseName}>{item.name}</Text>
      {item.sets && Array.isArray(item.sets) ? (
        <View style={styles.setsContainer}>
          {item.sets.map((set, index) => (
            <View key={index} style={styles.setContainer}>
              <View style={styles.infoContainer}>
                <Text style={styles.setText}>{set.kgs} Kgs</Text>
                <Text style={styles.setText}>x{set.reps}</Text>
                <Text style={styles.rest}>{set.rest}''</Text>
              </View>
              <Text style={styles.sets}>x {set.sets}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text>No sets available</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isEditingName ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.input}
              value={editRoutineName}
              onChangeText={setEditRoutineName}
            />
            <TouchableOpacity onPress={handleUpdateRoutineName} style={styles.saveButton}>
              <Ionicons name="checkmark-sharp" size={25} color="#F9BA31" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.titleContainer}>
            <Text style={styles.routineTitle}>{routineName}</Text>
            <View style={styles.editContainer}>
              <TouchableOpacity onPress={() => setIsEditingName(true)} style={styles.editIcon}>
                <Ionicons name="pencil" size={25} color="#F9BA31" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.deleteIcon}>
                <Ionicons name="trash" size={25} color="#F9BA31" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : exercises.length === 0 ? (
        <Text>No exercise yet</Text>
      ) : (
        <View style={{ flex: 1 }}>
          <DraggableFlatList
            data={exercises}
            renderItem={renderExercise}
            keyExtractor={(item) => item.id}
            onDragEnd={handleDragEnd}
          />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ExerciseBrowser', { routineId })}
        >
          <Text style={styles.addButtonText}>Add exercise</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveAndGoHomeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveAndGoHomeButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this routine?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteRoutine} style={[styles.modalButton, styles.deleteButton]}>
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginHorizontal: 5,
  },
  routineTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'gray',
  },
  editIcon: {
    paddingLeft: 10,
  },
  deleteIcon: {
    paddingLeft: 10,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 10,
    color: 'gray',
    borderRadius: 10,
  },
  saveButton: {
    paddingLeft: 10,
  },
  exerciseItem: {
    padding: 10,
    marginVertical: 4,
    backgroundColor: 'whitesmoke',
    borderRadius: 10,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
  },
  setsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  setContainer: {
    marginTop: 10,
    width: 70,
  },
  infoContainer: {
    borderRadius: 10,
    backgroundColor: 'white',
  },
  setText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  sets: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#F9BA31',
    borderRadius: 10,
    marginTop: 4,
  },
  rest: {
    color: '#F9BA31',
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  addButton: {
    backgroundColor: '#F9BA31',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10, 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveAndGoHomeButton: {
    backgroundColor: '#F9BA31',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  saveAndGoHomeButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'gray'
  },
  modalButtonText: {
    fontSize: 16,
    color: 'white'
  },
  deleteButton: {
    backgroundColor: '#F9BA31',
  },
});

export default AddRoutineScreen;
