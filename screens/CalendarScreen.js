import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, FlatList, TouchableOpacity, Modal, RefreshControl } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { auth } from '../firebaseConfig';  
import { getCompletedRoutines, saveCompletedRoutine, getUserRoutines, getRoutineExercises } from '../userFirestore';  
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

const CalendarScreen = () => {
    const [selectedDay, setSelectedDay] = useState('');
    const [routines, setRoutines] = useState({});
    const [markedDates, setMarkedDates] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [presetRoutines, setPresetRoutines] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            fetchCompletedRoutines(user.uid);
        }
    }, [user]);

    const fetchCompletedRoutines = async (userId) => {
        try {
            const completedRoutines = await getCompletedRoutines(userId);
            const routinesByDate = {};
    
            completedRoutines.forEach((routine, index) => {
                const routineDate = format(routine.completedAt, 'yyyy-MM-dd');
                if (!routinesByDate[routineDate]) {
                    routinesByDate[routineDate] = {};
                }
                const uniqueId = `${routine.name}-${routine.completedAt.getTime()}-${index}`;
                routinesByDate[routineDate][uniqueId] = { 
                    name: routine.name, 
                    uniqueId 
                };
            });
    
            setRoutines(routinesByDate);
            markTrainingDays(routinesByDate);
        } catch (error) {
            console.error('Error fetching completed routines:', error);
        }
    };

    const markTrainingDays = (routinesByDate) => {
        const marked = {};
        Object.keys(routinesByDate).forEach(date => {
            marked[date] = {
                marked: true,
                dotColor: 'orange',
            };
        });
        setMarkedDates(marked);
    };

    const handleDayPress = (day) => {
        setSelectedDay(day.dateString);
    };

    const addRoutineToDay = async (routine) => {
        if (!selectedDay) return;
        const exercises = await getRoutineExercises(user.uid, routine.id);

        const routineData = {
            name: routine.name,
            notes: routine.notes || '',
            exercises: exercises,
            completedAt: new Date(selectedDay),
        };

        try {
            await saveCompletedRoutine(user.uid, routineData);
            const uniqueId = `${routine.name}-${Date.now()}`;
            setRoutines((prevRoutines) => ({
                ...prevRoutines,
                [selectedDay]: {
                    ...(prevRoutines[selectedDay] || {}),
                    [uniqueId]: { name: routine.name, completedAt: routineData.completedAt },
                },
            }));

            setModalVisible(false);
        } catch (error) {
            console.error("Error al guardar la rutina: ", error);
        }
    };

    const fetchUserRoutines = async () => {
        if (user) {
            try {
                const userRoutines = await getUserRoutines(user.uid);
                setPresetRoutines(userRoutines);
            } catch (error) {
                console.error('Error fetching user routines: ', error);
            }
        }
    };

    useEffect(() => {
        fetchUserRoutines();
    }, [user]);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchCompletedRoutines(user.uid);
        setIsRefreshing(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Calendar
                    onDayPress={handleDayPress}
                    hideExtraDays={false}
                    firstDay={1}
                    markedDates={{
                        ...Object.keys(routines).reduce((acc, date) => {
                            acc[date] = {
                                marked: true,
                                dotColor: 'orange',
                                textColor: selectedDay === date ? 'white' : 'black',
                            };
                            return acc;
                        }, {}),
                        [selectedDay]: {
                            selected: true,
                            selectedColor: '#F9BA31',
                            textColor: 'white',
                        },
                    }}
                    theme={{
                        selectedDayBackgroundColor: '#F9BA31',
                        arrowColor: '#F9BA31',
                        todayTextColor: '#F9BA31',
                    }}
                />
                {selectedDay ? (
                    <>
                        {routines[selectedDay] && Object.keys(routines[selectedDay]).length > 0 ? (
                            <View style={styles.routinesContainer}>
                                <FlatList
                                    data={Object.values(routines[selectedDay])}
                                    renderItem={({ item }) => (
                                        <View style={styles.item}>
                                            <TouchableOpacity style={styles.icons}>
                                                <Ionicons name="pencil" size={20} color="#F9BA31" />
                                            </TouchableOpacity>
                                            <Text style={styles.itemText}>{item.name}</Text>
                                            <TouchableOpacity style={styles.icons}>
                                                <Ionicons name="trash" size={20} color="#F9BA31" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    keyExtractor={(item) => item.uniqueId}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={isRefreshing}
                                            onRefresh={onRefresh}
                                        />
                                    }
                                />
                            </View>
                        ) : (
                            <Text style={styles.noRoutinesText}>No routines added for this day</Text>
                        )}
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={styles.addButtonText}>Add a routine for this day</Text>
                        </TouchableOpacity>   
                    </>
                ) : (
                    <Text style={styles.selectDayText}>Please select a day</Text>
                )}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Select a Routine</Text>
                            <FlatList
                                data={presetRoutines}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.modalItem}
                                        onPress={() => addRoutineToDay(item)}
                                    >
                                        <Text style={styles.modalItemText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item.id}
                            />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonCancel]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.textStyle}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 50,
    },
    addButton: {
        backgroundColor: '#F9BA31',
        borderRadius: 10,
        padding: 15,
        margin: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    routinesContainer: {
        flex: 1,
        padding: 5,
    },
    routinesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    noRoutinesText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 20,
    },
    selectDayText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 20,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: 'whitesmoke',
        borderRadius: 10,
        paddingVertical: 30,
        padding: 10,
        margin: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'gray',
        textAlign: 'center',
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
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 300,
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
    modalItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
        alignItems: 'center',
    },
    modalItemText: {
        fontSize: 18,
        color: '#333',
    },
    modalButtons: {
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
        width: '100%',
    },
    button: {
        borderRadius: 5,
        padding: 10,
        elevation: 2,
    },
    buttonCancel: {
        backgroundColor: 'gray',
    },
    textStyle: {
        color: 'white',
        textAlign: 'center',
    },
    icons: {
        paddingHorizontal:10,
    }
});

export default CalendarScreen;
