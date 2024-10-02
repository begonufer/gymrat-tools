import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, FlatList, Alert } from 'react-native';
import { getUserRoutines, getExercises, getRoutine } from '../userFirestore';
import { auth } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

const AddWorkoutScreen = ({ navigation }) => {
    const [routines, setRoutines] = useState([]);
    const [selectedRoutineId, setSelectedRoutineId] = useState(null);
    const [loading, setLoading] = useState(true);
  
    const user = auth.currentUser;
  
    const fetchRoutines = useCallback(() => {
      const fetchData = async () => {
        try {
          const userId = user.uid;
          const fetchedRoutines = await getUserRoutines(userId);
          setRoutines(fetchedRoutines);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching routines: ', error);
          Alert.alert('Error', 'Failed to fetch routines.');
        }
      };
  
      fetchData();
    }, [user.uid]);
  
    useFocusEffect(fetchRoutines);
  
    const handleSelectRoutine = async (routineId) => {
        try {
            const userId = user.uid;
            const routine = await getRoutine(userId, routineId);
            const exercises = await getExercises(userId, routineId);
            const routineData = {
                name: routine.name,
                exercises: exercises,
            };
    
            navigation.navigate('Home', { routine: routineData });
        } catch (error) {
            console.error('Error fetching routine details: ', error);
            Alert.alert('Error', 'Failed to fetch routine details.');
        }
    };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
            <FlatList
            data={routines}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                style={styles.routineItem}
                onPress={() => handleSelectRoutine(item.id)}
                >
                <Text style={styles.routineName}>{item.name}</Text>
                </TouchableOpacity>
            )}
            />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
  },
  addButton: {
    backgroundColor: '#F9BA31',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  routineItem: {
    backgroundColor: '#F9BA31',
    height: 200,
    padding: 15,
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  routineText: {
    color: '#fff',
    fontSize: 24,
  },
});

export default AddWorkoutScreen;
