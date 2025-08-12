import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { dh, dw } from '../constants/Dimensions'
import { sunIcon } from '../constants/Images'
import ForecastCard from './ForecastCard'

const WeatherCard = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weather</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={sunIcon} style={styles.sunIcon} />
                <View>
                    <Text style={{ fontSize: 35, fontWeight: '600', paddingHorizontal: dw / 20 }}>28*C</Text>
                    <Text style={{ fontSize: 18, fontWeight: '600', paddingHorizontal: dw / 20 }}>Sunny</Text>
                </View>
            </View>
            <Text style={{ fontSize: 20, fontWeight: '500', paddingHorizontal: dw / 24, paddingVertical: dh / 35 }}>5-Day Forecast</Text>
            <View style={{ flexDirection: 'row' }}>
                <ForecastCard />
                <ForecastCard />
                <ForecastCard />
                <ForecastCard />
                <ForecastCard />
            </View>
        </View>
    )
}

export default WeatherCard

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    title: {
        fontSize: 25,
        fontWeight: '500',
        padding: 10,
        justifyContent: 'center',
        // alignSelf: "center"
    },
    sunIcon: {
        // backgroundColor: 'red',
        resizeMode: 'contain',
        height: dh / 8,
        width: dw / 7
    }
})