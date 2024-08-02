import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth } from '../firebaseConfig';
import { getUserInfo, storeUserInfo } from '../userFirestore';

const EditProfileScreen = ({ route, navigation }) => {
    const user = auth.currentUser;
    const { field } = route.params;
    const [value, setValue] = useState('');
    const [userInfo, setUserInfo] = useState({});
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    useEffect(() => {
        if (user) {
            getUserInfo(user.uid).then(data => {
                if (data) {
                    setUserInfo(data);
                    setValue(data[field]);
                }
            });
        }
    }, [user, field]);

    const handleSave = () => {
        const updatedInfo = { ...userInfo, [field]: value };
        storeUserInfo(user.uid, updatedInfo).then(() => {
            navigation.navigate('Profile', { updatedInfo });
        }).catch((error) => {
            console.error("Error updating user information: ", error);
        });
    };

    const renderInputField = () => {
        switch (field) {
            case 'birthdate':
                return (
                    <View>
                        <Button title="Select Date" onPress={() => setDatePickerVisibility(true)} />
                        {isDatePickerVisible && (
                            <DateTimePicker
                                value={value ? new Date(value) : new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setDatePickerVisibility(false);
                                    if (selectedDate) {
                                        setValue(selectedDate.toISOString().split('T')[0]);
                                    }
                                }}
                            />
                        )}
                        <Text style={styles.valueText}>{value}</Text>
                    </View>
                );
            case 'units':
                return (
                    <View style={styles.switchContainer}>
                        <Text>Kg</Text>
                        <Switch
                            value={value === 'kg'}
                            onValueChange={(newValue) => setValue(newValue ? 'kg' : 'lb')}
                        />
                        <Text>Lb</Text>
                    </View>
                );
            case 'weight':
            case 'height':
                return (
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={value.toString()}
                        onChangeText={(text) => {
                            if (field === 'weight') {
                                setValue(parseFloat(text).toFixed(1));
                            } else {
                                setValue(parseInt(text, 10));
                            }
                        }}
                    />
                );
            default:
                return (
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={setValue}
                    />
                );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Edit {field}</Text>
            {renderInputField()}
            <Button title="Save" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        marginBottom: 20,
        color: 'grey',
        fontSize: 15,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FAF3E4',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    valueText: {
        fontSize: 16,
        marginVertical: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
});

export default EditProfileScreen;
