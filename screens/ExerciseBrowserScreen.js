import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';


const ExerciseBrowserScreen = ({ route, navigation }) => {
    const { routineId } = route.params; 
    const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');

  const fetchExercises = async () => {
    setLoading(true);
    setError(null);

    const params = {};
    if (searchQuery.trim()) params.name = searchQuery.trim();
    if (selectedType) params.type = selectedType;
    if (selectedMuscle) params.muscle = selectedMuscle;

    try {
      const response = await axios.get('https://api.api-ninjas.com/v1/exercises', {
        headers: { 'X-Api-Key': 'raxH1tJmXCO1iQLwH85O8g==LxdjByPMT6zKslql' },
        params: params,
      });

      setExercises(response.data);
    } catch (error) {
      setError('Error fetching exercises');
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchExercises();
  };

  const resetType = () => {
    setSelectedType('');
  };

  const resetMuscle = () => {
    setSelectedMuscle('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.filtersContainer}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedType}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedType(itemValue)}
            >
              <Picker.Item label="Select exercise type" value="" />
              <Picker.Item label="Cardio" value="cardio" />
              <Picker.Item label="Olympic Weightlifting" value="olympic_weightlifting" />
              <Picker.Item label="Plyometrics" value="plyometrics" />
              <Picker.Item label="Powerlifting" value="powerlifting" />
              <Picker.Item label="Strength" value="strength" />
              <Picker.Item label="Stretching" value="stretching" />
              <Picker.Item label="Strongman" value="strongman" />
            </Picker>
            <TouchableOpacity onPress={resetType} style={styles.iconButton}>
                <Ionicons name="trash" size={25} color="#F9BA31" />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedMuscle}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedMuscle(itemValue)}
            >
              <Picker.Item label="Select muscle group" value="" />
              <Picker.Item label="Abdominals" value="abdominals" />
              <Picker.Item label="Abductors" value="abductors" />
              <Picker.Item label="Adductors" value="adductors" />
              <Picker.Item label="Biceps" value="biceps" />
              <Picker.Item label="Calves" value="calves" />
              <Picker.Item label="Chest" value="chest" />
              <Picker.Item label="Forearms" value="forearms" />
              <Picker.Item label="Glutes" value="glutes" />
              <Picker.Item label="Hamstrings" value="hamstrings" />
              <Picker.Item label="Lats" value="lats" />
              <Picker.Item label="Lower Back" value="lower_back" />
              <Picker.Item label="Middle Back" value="middle_back" />
              <Picker.Item label="Neck" value="neck" />
              <Picker.Item label="Quadriceps" value="quadriceps" />
              <Picker.Item label="Traps" value="traps" />
              <Picker.Item label="Triceps" value="triceps" />
            </Picker>
            <TouchableOpacity onPress={resetMuscle} style={styles.iconButton}>
            <Ionicons name="trash" size={25} color="#F9BA31" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search exercises..."
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Ionicons name="search" size={25} color="#F9BA31" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.resultsContainer}>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {error && <Text style={styles.error}>{error}</Text>}
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.exerciseItem}>
              <Image source={require('../assets/Dumbbell.jpg')} style={styles.exerciseImage} />
              <View style={styles.exerciseTextContainer}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.exerciseDetails}>{`${item.muscle} • ${item.type}`}</Text>
              </View>
              <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddExercise', { exercise: item, routineId: routineId })}>
                <Ionicons name="add" size={25} color="white" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 20,
    borderColor: '#FAF3E4',
    borderBottomWidth: 2,
  },
  filtersContainer: {
    marginBottom: 10,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
  },
  picker: {
    flex: 1,
    height: 60,
    color: 'gray',
    borderRadius: 10,
    backgroundColor: '#FAF3E4',
  },
  iconButton: {
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  input: {
    flex: 1,
    color: 'grey',
    fontSize: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FAF3E4',
  },
  searchButton: {
    marginLeft: 10,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  exerciseTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  exerciseName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  exerciseDetails: {
    color: 'grey',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  resultsContainer: {
    paddingHorizontal: 20,
  },
  exerciseImage: {
    width: 50,
    height: 50,
    marginEnd: 13,
  },
  addButton: {
    backgroundColor: '#F9BA31',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExerciseBrowserScreen;
