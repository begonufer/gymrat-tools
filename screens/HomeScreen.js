import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { auth } from '../firebaseConfig';
import { getUserInfo, saveCompletedRoutine } from '../userFirestore';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ route, navigation }) => {
  const user = auth.currentUser;
  const [userInfo, setUserInfo] = useState({});
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newKgs, setNewKgs] = useState('');
  const [newReps, setNewReps] = useState('');
  const [newSets, setNewSets] = useState('');
  const [newRest, setNewRest] = useState('');
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [currentSet, setCurrentSet] = useState(null);
  const [tempRoutineData, setTempRoutineData] = useState([]);
  const [completedExercises, setCompletedExercises] = useState({});

  useEffect(() => {
    if (user) {
      getUserInfo(user.uid).then(data => {
        if (data) {
          setUserInfo(data);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (route.params?.routine) {
      setSelectedRoutine(route.params.routine);
      saveRoutineToLocalStorage(route.params.routine);
    } else {
      loadRoutineFromLocalStorage();
    }
  }, [route.params?.routine]);

  const loadRoutineFromLocalStorage = async () => {
    try {
      const routine = await AsyncStorage.getItem('@selectedRoutine');
      if (routine !== null) {
        setSelectedRoutine(JSON.parse(routine));
      }
    } catch (error) {
      console.error('Error loading routine from local storage: ', error);
    }
  };

  const saveRoutineToLocalStorage = async (routine) => {
    try {
      await AsyncStorage.setItem('@selectedRoutine', JSON.stringify(routine));
    } catch (error) {
      console.error('Error saving routine to local storage: ', error);
    }
  };
  
  const cancelCancelRoutine = () => {
    setModalVisible(false);
  };
  
  const confirmCancelRoutine = () => {
    setCompletedExercises({});
    setSelectedRoutine(null);
    setModalVisible(false);
    removeRoutineFromLocalStorage();
  };  

  const removeRoutineFromLocalStorage = async () => {
    try {
      await AsyncStorage.removeItem('@selectedRoutine');
    } catch (error) {
      console.error('Error removing routine from local storage: ', error);
    }
  };
  
  const cancelEditSet = () => {
    setEditModalVisible(false);
  };
  
  const confirmEditSet = () => {
    if (currentSet) {
      const { exerciseIndex, setIndex } = currentSet;
      const updatedRoutine = { ...selectedRoutine };
      const newSet = {
        kgs: parseInt(newKgs),
        reps: parseInt(newReps),
        rest: parseInt(newRest),
        sets: parseInt(newSets),
        completed: false,
      };
      const currentSetData = updatedRoutine.exercises[exerciseIndex].sets[setIndex];
      const isModified = (
        currentSetData.kgs !== newSet.kgs ||
        currentSetData.reps !== newSet.reps ||
        currentSetData.rest !== newSet.rest ||
        currentSetData.sets !== newSet.sets
      );
  
      if (isModified) {
        updatedRoutine.exercises[exerciseIndex].sets[setIndex].completed = true;
        updatedRoutine.exercises[exerciseIndex].sets.splice(setIndex + 1, 0, newSet);
      } else {
        updatedRoutine.exercises[exerciseIndex].sets[setIndex] = newSet;
      }
      const updatedTempData = [...tempRoutineData];
      const existingExercise = updatedTempData.find(item => item.nameOfExercise === updatedRoutine.exercises[exerciseIndex].name);
  
      if (existingExercise) {
        if (isModified) {
          existingExercise.sets[setIndex].completed = true;
          const existingSetsArray = Object.values(existingExercise.sets);
          const updatedSetsArray = [
            ...existingSetsArray.slice(0, setIndex + 1),
            newSet,
            ...existingSetsArray.slice(setIndex + 1)
          ];
          existingExercise.sets = { ...updatedSetsArray };
        } else {
          existingExercise.sets[setIndex] = newSet;
        }
      } else {
        updatedTempData.push({
          nameOfExercise: updatedRoutine.exercises[exerciseIndex].name,
          sets: {
            [setIndex]: newSet
          }
        });
      }
      setTempRoutineData(updatedTempData);
      setSelectedRoutine(updatedRoutine);
      setEditModalVisible(false);
      saveRoutineToLocalStorage(updatedRoutine);
    }
  };
  
  const cancelSaveRoutine = () => {
    setConfirmationModalVisible(false);
  };

  const confirmSaveRoutine = () => {
    if (Object.keys(completedExercises).length === 0) {
      console.error('No hay ejercicios completados para guardar.');
      return;
    }
    const completedRoutine = {
      name: selectedRoutine.name,
      completedAt: new Date(),
      exercises: Object.keys(completedExercises).map((exerciseIndex) => {
        const exercise = completedExercises[exerciseIndex];
        return {
          nameOfExercise: exercise.nameOfExercise,
          sets: Object.keys(exercise.sets).map((setIndex) => {
            const set = exercise.sets[setIndex];
            return {
              kgs: set.kgs,
              reps: set.reps,
              rest: set.rest,
              sets: set.sets,
            };
          }),
        };
      }),
    };
    saveCompletedRoutine(user.uid, completedRoutine)
      .then(() => {
        setCompletedExercises({});
        setSelectedRoutine(null);
        removeRoutineFromLocalStorage();
      })
      .catch((error) => {
        console.error('Error saving routine: ', error);
      });
    setConfirmationModalVisible(false);
  };

  const decrementSetCountInLocalStorage = async (exerciseIndex, setIndex) => {
    try {
      const storedRoutine = await AsyncStorage.getItem('@selectedRoutine');
      
      if (storedRoutine !== null) {
        const routine = JSON.parse(storedRoutine);
        const exercise = routine.exercises[exerciseIndex];
        const set = exercise.sets[setIndex];
  
        if (exercise && set) {
          if (set.sets > 0) {
            set.sets -= 1;
          }
          if (set.sets === 0) {
            set.completed = true;
          }
          await AsyncStorage.setItem('@selectedRoutine', JSON.stringify(routine));
          setSelectedRoutine(routine);
          console.log('Set count updated and set marked as complete.');
        } else {
          console.error('No se encontró el ejercicio o set especificado.');
        }
      } else {
        console.error('No se encontró ninguna rutina guardada.');
      }
    } catch (error) {
      console.error('Error al modificar el número de veces del set en el almacenamiento local: ', error);
    }
  };
  
  const handleCancelRoutine = () => {
    setModalVisible(true);
  };

  const handleEditSet = (exerciseIndex, setIndex) => {
    const set = selectedRoutine.exercises[exerciseIndex].sets[setIndex];
    setCurrentSet({ exerciseIndex, setIndex, ...set });
    setNewKgs(set.kgs.toString());
    setNewReps(set.reps.toString());
    setNewSets(set.sets.toString());
    setNewRest(set.rest.toString());
    setEditModalVisible(true);
  };

  const handleMarkSetComplete = (exerciseIndex, setIndex) => {
    const exercise = selectedRoutine.exercises[exerciseIndex];
    const set = exercise.sets[setIndex];
    const updatedCompletedExercises = { ...completedExercises };

    if (!updatedCompletedExercises[exerciseIndex]) {
      updatedCompletedExercises[exerciseIndex] = {
        nameOfExercise: exercise.name,
        sets: {
          [setIndex]: {
            kgs: set.kgs,
            reps: set.reps,
            rest: set.rest,
            sets: 1,
          },
        },
      };
    } else {
      if (!updatedCompletedExercises[exerciseIndex].sets[setIndex]) {
        updatedCompletedExercises[exerciseIndex].sets[setIndex] = {
          kgs: set.kgs,
          reps: set.reps,
          rest: set.rest,
          sets: 1,
        };
      } else {
        updatedCompletedExercises[exerciseIndex].sets[setIndex].sets += 1;
      }
    }
    setCompletedExercises(updatedCompletedExercises);
    decrementSetCountInLocalStorage(exerciseIndex, setIndex);
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Hi, {userInfo.name}!</Text>
      </View>
      <View style={styles.content}>
        {!selectedRoutine ? (
          <View style={styles.buttonWorkoutContainer}>
            <Text style={styles.buttonWorkout}>Add a workout for today!</Text>
            <Animatable.View
              animation="pulse"
              easing="ease-in-out"
              iterationCount="infinite"
              style={styles.circleButton}>
              <TouchableOpacity onPress={() => navigation.navigate('AddWorkout')}>
                <Ionicons name="add" size={90} color="#F9BA31"/>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.routineContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelRoutine}>
                <Ionicons name="close" size={40} color="#F9BA31" />
              </TouchableOpacity>
              <Text style={styles.routineTitle}>{selectedRoutine.name}</Text>
              <TouchableOpacity style={styles.doneButton} onPress={() => setConfirmationModalVisible(true)}>
                <Ionicons name="checkmark" size={40} color="#F9BA31" />
              </TouchableOpacity>
              <View style={styles.exercisesList}>
                {selectedRoutine.exercises.map((exercise, exerciseIndex) => (
                  <View key={exerciseIndex} style={[styles.exerciseItem, exercise.completed && styles.completedExercise]}>
                    <View style={styles.exerciseHeader}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                    </View>
                    {exercise.sets && Array.isArray(exercise.sets) ? (
                      <View style={styles.setsContainer}>
                        {exercise.sets.map((set, setIndex) => (
                          <View key={setIndex} style={[styles.setContainer, set.completed && styles.completedSet]}>
                            <TouchableOpacity 
                              style={styles.infoContainer}
                              onPress={() => handleEditSet(exerciseIndex, setIndex)}
                            >
                              <Text style={styles.setText}>{set.kgs} Kgs</Text>
                              <Text style={styles.setText}>x{set.reps}</Text>
                              <Text style={styles.rest}>{set.rest}''</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => !set.completed && handleMarkSetComplete(exerciseIndex, setIndex)}
                              disabled={set.completed}
                            >
                              <Text style={[styles.sets, set.completed && styles.completedSets]}>x {set.sets}</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text>No sets available</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Cancel Routine Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTextSure}>Are you sure you want to cancel this routine?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={cancelCancelRoutine}>
                <Text style={styles.textStyle}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={confirmCancelRoutine}>
                <Text style={styles.textStyle}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Set Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(!editModalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit Set</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.modalInput, styles.inputAlignRight]}
                placeholder="Kgs"
                keyboardType="numeric"
                value={newKgs}
                onChangeText={setNewKgs}
              />
              <Text style={styles.unit}>Kgs</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.modalInput, styles.inputAlignRight]}
                placeholder="Reps"
                keyboardType="numeric"
                value={newReps}
                onChangeText={setNewReps}
              />
              <Text style={styles.unit}>Reps</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.setUnit}>x</Text>
              <TextInput
                style={[styles.modalInput, styles.setInput, styles.inputAlignLeft]}
                placeholder="Sets"
                keyboardType="numeric"
                value={newSets}
                onChangeText={setNewSets}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.modalInput, styles.inputAlignRight]}
                placeholder="Rest"
                keyboardType="numeric"
                value={newRest}
                onChangeText={setNewRest}
              />
              <Text style={styles.unit}>Sec</Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={cancelEditSet}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={confirmEditSet}>
                <Text style={styles.textStyle}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmationModalVisible}
        onRequestClose={() => setConfirmationModalVisible(!confirmationModalVisible)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTextSure}>All exercises are complete. Do you want to save the routine?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={cancelSaveRoutine}>
                <Text style={styles.textStyle}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={confirmSaveRoutine}>
                <Text style={styles.textStyle}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    backgroundColor: '#F9BA31',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    width: '100%',
    paddingTop: 35,
    padding: 10,
  },
  bannerText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  buttonWorkoutContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    width: 200,
    borderRadius: 10,
    backgroundColor: '#F9BA31',
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonWorkout: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  circleButton: {
    width: 90,
    height: 90,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  routineContainer: {
    padding: 20,
    width: '100%',
    borderRadius: 10,
  },
  cancelButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  doneButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  routineTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
  },
  exercisesList: {
    marginTop: 10,
  },
  exerciseItem: {
    padding: 10,
    marginVertical: 4,
    backgroundColor: 'whitesmoke',
    borderRadius: 10,
  },
  completedExercise: {
    opacity: 0.7,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  completedSet: {
    opacity: 0.3,
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
  completedSets: {
    backgroundColor: '#b0b0b0',
  },
  rest: {
    color: '#F9BA31',
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#F9BA31',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    color: 'white',
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
  modalTextSure: {
    fontSize: 16,
    padding: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: 'gray',
    marginTop: 30,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
  },
  button: {
    backgroundColor: '#F9BA31',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%',
  },
  buttonCancel: {
    backgroundColor: 'gray',
  },
  buttonConfirm: {
    backgroundColor: '#F9BA31',
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalInput: {
    padding: 5,
    fontSize: 20,
    color: 'gray',
    fontWeight: 'bold',
    textAlign: 'right',
    height: 40,
    flex: 1,
    minWidth: 30,
    maxWidth: 70,
  },
  input: {
    alignSelf: 'flex-start',
  },
  setInput: {
    textAlign: 'left',
    alignSelf: 'flex-end',
  },
  inputAlignRight: {
    marginRight: 5,
  },
  inputAlignLeft: {
    marginLeft: 5,
  },
  unit: {
    fontSize: 16,
    color: 'gray',
    width: 50,
    textAlign: 'left',
  },
  setUnit: {
    fontSize: 16,
    color: 'gray',
    width: 50,
    textAlign: 'right',
  }
});

export default HomeScreen;