import { Image, StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SettingScreen from '../screens/SettingScreen';
import { HomeFilledIcon, HomeIcon, settingFilledIcon, settingIcon } from '../constants/Images';

const Tab = createBottomTabNavigator();

const RootNavigator = () => {
    return (
        <Tab.Navigator initialRouteName='Home' screenOptions={{
            tabBarStyle: { position: 'absolute' }, headerShown: false,
            tabBarShowLabel: false,
        }}>
            <Tab.Screen name='Home' component={HomeScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <Image
                        source={focused ? HomeFilledIcon : HomeIcon}
                        style={{ width: 24, height: 24 }}
                        resizeMode='contain'
                    />
                )
            }} />
            <Tab.Screen name='Settings' component={SettingScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <Image
                        source={focused ? settingFilledIcon : settingIcon}
                        style={{ width: 24, height: 24 }}
                        resizeMode='contain'
                    />
                )
            }} />
        </Tab.Navigator>
    )
}

export default RootNavigator

const styles = StyleSheet.create({})