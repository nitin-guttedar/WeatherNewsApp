import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { dh, dw } from '../constants/Dimensions'
import { sunIcon } from '../constants/Images'

const ForecastCard = () => {
    return (
        <View style={styles.mainContainer}>
            <Text style={styles.text}>Mon</Text>
            <Image source={sunIcon} style={styles.iconStyle} />
            <Text style={styles.text}>28*</Text>
        </View>
    )
}

export default ForecastCard

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#F2F2F2',
        width: dw / 7,
        alignItems: 'center',
        borderRadius: 7,
        marginHorizontal: 10
    },
    iconStyle: {
        resizeMode: 'contain',
        // backgroundColor: 'red',
        width: dw / 14,
        height: dh / 18
    },
    text: {
        paddingVertical: 5,
        fontSize: 15,
        fontWeight: '500'
    }
})