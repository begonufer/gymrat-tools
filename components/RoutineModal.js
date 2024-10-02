import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const RoutineModal = ({ visible, onClose, onConfirm, message }) => (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalView}>
                <Text style={styles.modalTextSure}>{message}</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={onClose}>
                        <Text style={styles.textStyle}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.buttonConfirm]} onPress={onConfirm}>
                        <Text style={styles.textStyle}>Yes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTextSure: {
        fontSize: 16,
        padding: 20,
        marginBottom: 10,
        textAlign: 'center',
        color: 'gray',
        marginTop: 30,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 20,
    },
    button: {
        backgroundColor: '#F9BA31',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '48%',
    },
    buttonCancel: {
        backgroundColor: 'gray',
    },
    buttonConfirm: {
        backgroundColor: '#F9BA31',
    },
    textStyle: {
        color: 'white',
        textAlign: 'center',
    },
});

export default RoutineModal;
