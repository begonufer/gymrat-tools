import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Banner = ({ userName }) => (
    <View style={styles.banner}>
        <Text style={styles.bannerText}>Hi, {userName}!</Text>
    </View>
);

const styles = StyleSheet.create({
    banner: {
        backgroundColor: '#F9BA31',
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        width: '100%',
        paddingTop: 35,
        padding: 10,
    },
    bannerText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
});

export default Banner;
