import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ExerciseSet = ({ set, onEditSet, onMarkSetComplete }) => (
    <View style={[styles.setContainer, set.completed && styles.completedSet]}>
        <TouchableOpacity style={styles.infoContainer} onPress={onEditSet}>
            <Text style={styles.setText}>{set.kgs} Kgs</Text>
            <Text style={styles.setText}>x{set.reps}</Text>
            <Text style={styles.rest}>{set.rest}''</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onMarkSetComplete}>
            <Text style={[styles.sets, set.completed && styles.completedSets]}>x {set.sets}</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
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
});

export default ExerciseSet;
