import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Button, TextInput, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
    const [selectedDay, setSelectedDay] = useState('');
    const [items, setItems] = useState([]);
    const [itemText, setItemText] = useState('');

    const handleDayPress = (day) => {
        setSelectedDay(day.dateString);
        console.log('selected day', day);
    };

    const addItem = () => {
        if (itemText.trim()) {
            setItems([...items, { key: `${selectedDay}-${itemText}`, text: itemText }]);
            setItemText('');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Calendar
                    onDayPress={handleDayPress}
                    onMonthChange={(month) => {
                        console.log('month changed', month);
                    }}
                    hideExtraDays={false}
                    firstDay={1}
                    showWeekNumbers={false}
                    markedDates={{
                        [selectedDay]: {
                            selected: true,
                            selectedColor: 'orange',
                        },
                    }}
                    theme={{
                        selectedDayBackgroundColor: 'orange',
                        arrowColor: 'orange',
                        todayTextColor: 'orange',
                    }}
                />
                {selectedDay ? (
                    <View style={styles.menu}>
                        <Text style={styles.menuTitle}>Add training</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Add item"
                            value={itemText}
                            onChangeText={setItemText}
                        />
                        <Button title="Add Item" onPress={addItem} />
                        <FlatList
                            data={items.filter(item => item.key.startsWith(selectedDay))}
                            renderItem={({ item }) => <Text style={styles.item}>{item.text}</Text>}
                            keyExtractor={item => item.key}
                        />
                    </View>
                ) : null}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 40,
        justifyContent: 'flex-start',
        paddingTop: 10,
    },
    menu: {
        marginTop: 20,
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
});

export default CalendarScreen;
