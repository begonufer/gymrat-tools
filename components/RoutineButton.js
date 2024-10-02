import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const RoutineButton = ({ navigation }) => (
    <View>
        <Text>Add a workout for today!</Text>
        <Animatable.View
            animation="pulse"
            easing="ease-in-out"
            iterationCount="infinite"
        >
            <TouchableOpacity onPress={() => navigation.navigate('AddWorkout')}>
                <Ionicons name="add" size={90} color="#F9BA31"/>
            </TouchableOpacity>
        </Animatable.View>
    </View>
);

const styles = StyleSheet.create({
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
});

export default RoutineButton;
