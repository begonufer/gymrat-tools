import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ExerciseSet from './ExerciseSet';

const ExerciseItem = ({ exercise, onMarkExerciseComplete, onEditSet, onMarkSetComplete }) => (
    <View style={[styles.exerciseItem, exercise.completed && styles.completedExercise]}>
        <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <TouchableOpacity onPress={onMarkExerciseComplete}>
                <Ionicons name={exercise.completed ? "checkmark-circle" : "checkmark-circle-outline"} size={24} color="#F9BA31" />
            </TouchableOpacity>
        </View>
        {exercise.sets && Array.isArray(exercise.sets) ? (
            <View style={styles.setsContainer}>
                {exercise.sets.map((set, setIndex) => (
                    <ExerciseSet 
                        key={setIndex} 
                        set={set} 
                        onEditSet={() => onEditSet(setIndex)} 
                        onMarkSetComplete={() => onMarkSetComplete(setIndex)}
                    />
                ))}
            </View>
        ) : (
            <Text>No sets available</Text>
        )}
    </View>
);

const styles = StyleSheet.create({
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
        justifyContent: 'space-between',
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
});

export default ExerciseItem;
