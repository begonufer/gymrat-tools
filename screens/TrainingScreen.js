import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList, Alert, RefreshControl } from 'react-native';
import { getUserRoutines } from '../userFirestore';
import { auth } from '../firebaseConfig';

const TrainingScreen = ({ navigation, route }) => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = auth.currentUser;

  const fetchRoutines = async () => {
    setLoading(true);
    try {
      const userId = user.uid;
      const fetchedRoutines = await getUserRoutines(userId); 
      if (fetchedRoutines.length > 0) {
        setRoutines(fetchedRoutines);
      } else {
        Alert.alert('No Routines', 'You have no routines.');
      }
    } catch (error) {
      console.error('Error fetching routines: ', error);
      Alert.alert('Error', 'Failed to fetch routines.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, [user.uid]);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchRoutines();
    }
  }, [route.params?.refresh]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRoutines();
  };

  const renderRoutine = ({ item }) => (
    <TouchableOpacity
      style={styles.routineItem}
      onPress={() => navigation.navigate('AddRoutine', { routineId: item.id })}
    >
      <Text style={styles.routineText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : routines.length === 0 ? (
        <Text>No routines found</Text>
      ) : (
        <FlatList
          data={routines}
          renderItem={renderRoutine}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTraining')}>
        <Text style={styles.addButtonText}>Add training</Text>
      </TouchableOpacity>
    </SafeAreaView>
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

export default TrainingScreen;
