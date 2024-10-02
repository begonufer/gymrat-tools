import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import TrainingScreen from './screens/TrainingScreen';
import AddTrainingScreen from './screens/AddTrainingScreen';
import DetailScreen from './screens/DetailScreen';
import CalendarScreen from './screens/CalendarScreen';
import ExerciseBrowserScreen from './screens/ExerciseBrowserScreen';
import AddExerciseScreen from './screens/AddExerciseScreen';
import AddRoutineScreen from './screens/AddRoutineScreen';
import EditExerciseScreen from './screens/EditExerciseScreen';
import AddWorkoutScreen from './screens/AddWorkoutScreen';
import DoingWorkoutScreen from './screens/DoingWorkoutScreen';

import { auth } from './firebaseConfig';
import { StyleSheet } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Calendar':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Training':
              iconName = focused ? 'fitness' : 'fitness-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F9BA31',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: { paddingBottom: 8, height: 65, paddingTop: 7 },
        tabBarLabelStyle: { paddingBottom: 1 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Training" component={TrainingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser ? authUser : null);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Detail" component={DetailScreen} options={{ headerShown: true }} />
            <Stack.Screen name="Training" component={TrainingScreen}/>
            <Stack.Screen name="AddTraining" component={AddTrainingScreen} options={{ headerShown: true, headerTitle: () => null, headerBackTitleVisible: false, }} />
            <Stack.Screen name="ExerciseBrowser" component={ExerciseBrowserScreen} options={{ headerShown: true, headerTitle: () => null, headerBackTitleVisible: false, }} />
            <Stack.Screen name="AddExercise" component={AddExerciseScreen} options={{ headerShown: true, headerTitle: () => null, headerBackTitleVisible: false, }} />
            <Stack.Screen name="AddRoutine" component={AddRoutineScreen} options={{ headerShown: true, headerTitle: () => null, headerBackTitleVisible: false, }} />
            <Stack.Screen name="EditExercise" component={EditExerciseScreen} options={{ headerShown: true, headerTitle: () => null, headerBackTitleVisible: false, }} />
            <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} />
            <Stack.Screen name="DoingWorkout" component={DoingWorkoutScreen} />
          </>
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
