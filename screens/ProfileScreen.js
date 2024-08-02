import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Button } from 'react-native';
import { auth } from '../firebaseConfig';
import { Avatar } from 'react-native-elements';
import { getUserInfo, storeUserInfo } from '../userFirestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation, route }) => {
  const user = auth.currentUser;
  const [userInfo, setUserInfo] = useState({});
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (user) {
      getUserInfo(user.uid).then(data => {
        if (data) {
          setUserInfo(data);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (route.params?.updatedInfo) {
      setUserInfo(route.params.updatedInfo);
    }
  }, [route.params?.updatedInfo]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.replace('Login');
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  const handleEditProfile = (field) => {
    setEditField(field);
    setEditValue(userInfo[field]);
  };

  const handleSave = () => {
    const updatedInfo = { ...userInfo, [editField]: editValue };
    storeUserInfo(user.uid, updatedInfo).then(() => {
      setUserInfo(updatedInfo);
      setEditField(null);
    }).catch((error) => {
      console.error("Error updating user information: ", error);
    });
  };

  const maskPassword = (password) => {
    return password ? '•'.repeat(password.length) : ' ';
  };

  const formatDate = (dateString) => {
    if (!dateString) return ' ';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleUnitChange = (group, value) => {
    setUserInfo(prevInfo => ({
      ...prevInfo,
      [group]: value
    }));
    setEditValue(value); 
  };

  const renderInputField = (field) => {
    switch (field) {
      case 'birthdate':
        return (
          <View style={styles.dateContainer}>
            <Ionicons name="calendar" size={20} color="gray" style={[styles.icon, styles.calendarIcon]} onPress={() => setDatePickerVisibility(true)} />
            {isDatePickerVisible && (
              <DateTimePicker
                value={editValue ? new Date(editValue) : new Date()}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  setDatePickerVisibility(false);
                  if (selectedDate) {
                    setEditValue(selectedDate.toISOString().split('T')[0]);
                  }
                }}
              />
            )}
            <Text style={styles.birthdateEdit}>{formatDate(editValue)}</Text>
          </View>
        );
      case 'units':
        return (
          <View style={styles.checkboxGroupContainer}>
            <View style={styles.checkboxGroup}>
              <Text style={styles.checkboxGroupLabel}>Weight:</Text>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => handleUnitChange('weightUnit', 'Kg')}>
                  <Ionicons
                    name={userInfo.weightUnit === 'Kg' ? 'disc-sharp' : 'ellipse-outline'}
                    size={20}
                    color="#F9BA31"
                  />
                  <Text style={styles.checkboxLabel}>Kg</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => handleUnitChange('weightUnit', 'Lbs')}>
                  <Ionicons
                    name={userInfo.weightUnit === 'Lbs' ? 'disc-sharp' : 'ellipse-outline'}
                    size={20}
                    color="#F9BA31"
                  />
                  <Text style={styles.checkboxLabel}>Lbs</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.checkboxGroup}>
              <Text style={styles.checkboxGroupLabel}>Distance:</Text>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => handleUnitChange('distanceUnit', 'Km')}>
                  <Ionicons
                    name={userInfo.distanceUnit === 'Km' ? 'disc-sharp' : 'ellipse-outline'}
                    size={20}
                    color="#F9BA31"
                  />
                  <Text style={styles.checkboxLabel}>Km</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => handleUnitChange('distanceUnit', 'Mi')}>
                  <Ionicons
                    name={userInfo.distanceUnit === 'Mi' ? 'disc-sharp' : 'ellipse-outline'}
                    size={20}
                    color="#F9BA31"
                  />
                  <Text style={styles.checkboxLabel}>Mi</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      case 'weight':
      case 'height':
        return (
          <TextInput
            style={[styles.input, styles.numberInput]}
            keyboardType="numeric"
            value={editValue.toString()}
            onChangeText={(text) => {
              if (field === 'weight') {
                setEditValue(parseFloat(text).toFixed(1));
              } else {
                setEditValue(parseInt(text, 10));
              }
            }}
          />
        );
      case 'password':
        return (
          <TextInput
            style={[styles.input, styles.autoWidthInput]}
            value={editValue}
            onChangeText={setEditValue}
            secureTextEntry={true}
          />
        );
      case 'sex':
        return (
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setEditValue('Male')}>
              <Ionicons
                name={editValue === 'Male' ? 'disc-sharp' : 'ellipse-outline'}
                size={20}
                color="#F9BA31"
              />
              <Text style={styles.checkboxLabel}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setEditValue('Female')}>
              <Ionicons
                name={editValue === 'Female' ? 'disc-sharp' : 'ellipse-outline'}
                size={20}
                color="#F9BA31"
              />
              <Text style={styles.checkboxLabel}>Female</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return (
          <TextInput
            style={[styles.input, styles.autoWidthInput]}
            value={editValue}
            onChangeText={setEditValue}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Avatar
          rounded
          size="xlarge"
          source={user.photoURL ? { uri: user.photoURL } : require('../assets/default-avatar.png')}
          containerStyle={styles.avatar}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.infoContainer}>
          {[
            { label: 'Name', value: userInfo.name, field: 'name' },
            { label: 'Email', value: userInfo.email, field: 'email' },
            { label: 'Birthdate', value: formatDate(userInfo.birthdate), field: 'birthdate' },
            { label: 'Sex', value: userInfo.sex, field: 'sex' },
            { label: 'Height', value: `${userInfo.height}${' cm'}`, field: 'height' },
            { label: 'Weight', value: userInfo.weight, field: 'weight' },
            { label: 'Units', value: `${userInfo.weightUnit ? `${userInfo.weightUnit}, ` : ''}${userInfo.distanceUnit ? `${userInfo.distanceUnit}` : ''}`, field: 'units' },
            { label: 'Password', value: maskPassword(userInfo.password), field: 'password' },
          ].map((item) => (
            <View key={item.field} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              {editField === item.field ? (
                <View style={styles.editContainer}>
                  {renderInputField(item.field)}
                  <Ionicons name="checkmark-sharp" size={25} color="gray" style={[styles.icon, styles.thickIcon]} onPress={handleSave}/>
                </View>
              ) : (
                <TouchableOpacity onPress={() => handleEditProfile(item.field)} style={styles.infoValueContainer}>
                  <Text style={styles.infoValue}>{item.value || ' '}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 50, 
  },
  banner: {
    backgroundColor: '#F9BA31',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  avatar: {
    position: 'absolute',
    bottom: -50,
    borderWidth: 5,
    borderColor: '#fff',
    zIndex: 2,
  },
  infoContainer: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: 'gray',
    marginEnd: 10,
  },
  infoValueContainer: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 16,
    color: 'gray',
    fontWeight: 'bold',
    marginEnd: 10, 
  },
  icon: {
    marginLeft: 10,
  },
  thickIcon: {
    fontWeight: 'bold',
    color: '#F9BA31',
  },
  calendarIcon: {
    marginEnd: 10,
    paddingEnd: 10,
  },
  birthdateEdit: { 
    fontSize: 16,
    color: 'gray',
    marginEnd: 10, 
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#FAF3E4',
    fontSize: 16,
    paddingStart: 10,
    color: 'gray',
    paddingVertical: 5,
    textAlign: 'center',
    paddingEnd: 10,
    borderRadius: 10,
  },
  numberInput: {
    paddingEnd: 10,
    maxWidth: '30%',
  },
  checkboxGroupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  checkboxGroup: {
    flex: 1,
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: 'gray',
    marginHorizontal: 2,
  },
  checkboxGroupLabel: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: '#F9BA31',
    paddingVertical: 17,
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF3E4',
    fontSize: 16,
    paddingStart: 10,
    paddingEnd: 10,
    paddingVertical: 5,
    textAlign: 'center',
    borderRadius: 10,
  },
});

export default ProfileScreen;
