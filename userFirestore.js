import { db } from './firebaseConfig';
import { collection, doc, addDoc, getDoc, setDoc, getDocs, updateDoc, deleteDoc, orderBy, query, writeBatch, Timestamp } from 'firebase/firestore';

export const getRoutineExercises = async (userId, routineId) => {
  try {
    const exercisesRef = collection(db, 'users', userId, 'routines', routineId, 'exercises');
    const exercisesSnapshot = await getDocs(query(exercisesRef, orderBy("position")));
    const exercises = exercisesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        nameOfExercise: data.name,
        sets: Object.keys(data.sets).map(setKey => ({
          kgs: data.sets[setKey].kgs,
          reps: data.sets[setKey].reps,
          rest: data.sets[setKey].rest,
          sets: data.sets[setKey].sets,
        })),
      };
    });
    return exercises;
  } catch (error) {
    console.error('Error fetching routine exercises: ', error);
    throw error;
  }
};

export const getCompletedRoutines = async (userId) => {
  try {
    const completedRoutinesRef = collection(db, 'users', userId, 'completedRoutines');
    const querySnapshot = await getDocs(completedRoutinesRef);
    const completedRoutines = [];
    querySnapshot.forEach((doc) => {
      const routineData = doc.data();
      completedRoutines.push({
        ...routineData,
        completedAt: routineData.completedAt.toDate(),
      });
    });
    return completedRoutines;
  } catch (error) {
    console.error('Error fetching completed routines: ', error);
    throw error;
  }
};

export const saveCompletedRoutine = async (userId, routineData) => {
  try {
    const completedRoutinesRef = collection(db, 'users', userId, 'completedRoutines');
    const docRef = await addDoc(completedRoutinesRef, {
      ...routineData,
    });
    console.log('Routine saved with ID:', docRef.id);
  } catch (error) {
    console.error('Error saving routine: ', error);
    throw error;
  }
};


export const updateRoutine = async (userId, routineId, updatedRoutine) => {
  try {
    const routineRef = doc(db, "users", userId, "completedRoutines", routineId);
    await updateDoc(routineRef, updatedRoutine);
    console.log('Routine updated successfully!');
  } catch (error) {
    console.error('Error updating routine: ', error);
    throw new Error('Failed to update routine.');
  }
};

export const saveTemporaryRoutine = async (userId, routine) => {
  try {
    const tempRoutinesRef = collection(db, "users", userId, "temporaryRoutines");
    const docRef = await addDoc(tempRoutinesRef, {
      ...routine,
      savedAt: Timestamp.now()
    });
    console.log('Temporary routine saved successfully!');
    return docRef.id;
  } catch (error) {
    console.error('Error saving temporary routine: ', error);
    throw new Error('Failed to save temporary routine.');
  }
};

export const updateExercisePosition = async (userId, routineId, exerciseId, newPosition) => {
  try {
    const exerciseRef = doc(db, "users", userId, "routines", routineId, "exercises", exerciseId);
    await updateDoc(exerciseRef, { position: newPosition });
    console.log('Exercise position updated successfully!');
  } catch (error) {
    console.error('Error updating exercise position: ', error);
    throw new Error('Failed to update exercise position.');
  }
};

export const updateExercise = async (userId, routineId, exerciseId, updatedExercise) => {
  try {
    const exerciseRef = doc(db, "users", userId, "routines", routineId, "exercises", exerciseId);
    await updateDoc(exerciseRef, updatedExercise);
    console.log('Exercise updated successfully!');
  } catch (error) {
    console.error('Error updating exercise: ', error);
    throw new Error('Failed to update exercise.');
  }
};

export const deleteRoutine = async (userId, routineId) => {
  try {
    const routineRef = doc(db, "users", userId, "routines", routineId);
    await deleteDoc(routineRef);
  } catch (error) {
    console.error('Error deleting routine: ', error);
    throw error;
  }
};

export const getUserRoutines = async (userId) => {
  try {
    const routinesRef = collection(db, "users", userId, "routines");
    const routinesSnapshot = await getDocs(routinesRef);
    const routines = routinesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return routines;
  } catch (error) {
    console.error('Error fetching user routines: ', error);
    throw error;
  }
};

export const addExerciseToRoutine = async (userId, routineId, exercise, sets) => {
  try {
    const exercisesRef = collection(db, 'users', userId, 'routines', routineId, 'exercises');
    const exercisesSnapshot = await getDocs(exercisesRef);
    const currentExercises = exercisesSnapshot.docs.map(doc => doc.data());
    const position = currentExercises.length;
    await addDoc(exercisesRef, {
      name: exercise.name,
      type: exercise.type,
      muscle: exercise.muscle,
      equipment: exercise.equipment,
      instructions: exercise.instructions,
      sets: sets,
      position: position,
      createdAt: Timestamp.now(),
    });
    console.log('Exercise added successfully!');
  } catch (error) {
    console.error('Error adding exercise to routine: ', error);
    throw error;
  }
};

export const getRoutine = async (userId, routineId) => {
  try {
    const routineDoc = await getDoc(doc(db, "users", userId, "routines", routineId));
    if (routineDoc.exists()) {
      return routineDoc.data();
    } else {
      console.log("No such routine!");
      return null;
    }
  } catch (error) {
    console.error('Error getting routine: ', error);
    throw error;
  }
};

export const getExercises = async (userId, routineId) => {
  try {
    const exercisesRef = collection(db, "users", userId, "routines", routineId, "exercises");
    const exercisesSnapshot = await getDocs(query(exercisesRef, orderBy("position")));
    const exercises = exercisesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return exercises;
  } catch (error) {
    console.error('Error getting exercises: ', error);
    throw error;
  }
};

export const storeRoutine = async (userId, routine) => {
  try {
    const routinesRef = collection(db, "users", userId, "routines");
    const docRef = await addDoc(routinesRef, routine);
    console.log('Routine successfully written!');
    return docRef.id;
  } catch (error) {
    console.error('Error writing routine: ', error);
    throw error;
  }
};

export const updateRoutineName = async (userId, routineId, newName) => {
  try {
    const routineRef = doc(db, "users", userId, "routines", routineId);
    await updateDoc(routineRef, { name: newName });
    console.log('Routine name successfully updated!');
  } catch (error) {
    console.error('Error updating routine name: ', error);
    throw error;
  }
};

export const storeUserInfo = async (userId, userInfo) => {
  try {
    await setDoc(doc(db, "users", userId), userInfo);
    console.log("User information successfully written!");
  } catch (error) {
    console.error("Error writing user information: ", error);
  }
};

export const getUserInfo = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user information: ", error);
    return null;
  }
};
