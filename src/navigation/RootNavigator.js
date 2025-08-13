import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SettingScreen from '../screens/SettingScreen';
import {
    HomeFilledIcon,
    HomeIcon,
    settingFilledIcon,
    settingIcon,
} from '../constants/Images';

const Tab = createBottomTabNavigator();

const RootNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarStyle: {
                    height: 50,
                    paddingHorizontal: 10,
                    alignItems: 'center',
                    justifyContent: 'space-around',
                },
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#1877F2',
                tabBarInactiveTintColor: '#8E8E93',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <View style={styles.tabItemContainer}>
                            <Image
                                source={focused ? HomeFilledIcon : HomeIcon}
                                style={{ width: 24, height: 24, tintColor: color }}
                                resizeMode="contain"
                            />
                            <Text style={[styles.tabLabel, { color: color }]}>Home</Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <View style={styles.tabItemContainer}>
                            <Image
                                source={focused ? settingFilledIcon : settingIcon}
                                style={{ width: 24, height: 24, tintColor: color }}
                                resizeMode="contain"
                            />
                            <Text style={[styles.tabLabel, { color: color }]}>Settings</Text>
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default RootNavigator;

const styles = StyleSheet.create({
    tabItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderRadius: 20,
        minWidth: 80,
        justifyContent: 'center',
        height: 40,
    },
    tabLabel: {
        fontSize: 14,
        marginLeft: 8,
        fontWeight: 'bold',
    },
});
