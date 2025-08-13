import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dh, dw } from '../constants/Dimensions';

// Assuming dw and dh are already declared somewhere (imported from utils/dimensions)


const SettingsScreen = () => {
    const [tempUnit, setTempUnit] = useState('C');
    const [categories, setCategories] = useState({
        Technology: true,
        Sports: true,
        Politics: false,
        Entertainment: true
    });
    const [refreshInterval, setRefreshInterval] = useState('15');

    const toggleCategory = (cat) => {
        setCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    // Custom radio UI
    const RadioButton = ({ selected }) => (
        <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
            {selected && <View style={styles.radioInner} />}
        </View>
    );

    // Custom checkbox UI
    const CheckBox = ({ checked }) => (
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
            {checked && <Text style={styles.checkboxTick}>✓</Text>}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <Text style={styles.title}>Settings</Text>

                {/* Temperature Units */}
                <Text style={styles.sectionTitle}>Temperature Units</Text>
                <View style={styles.optionRow}>
                    <TouchableOpacity style={styles.option} onPress={() => setTempUnit('C')}>
                        <RadioButton selected={tempUnit === 'C'} />
                        <Text style={styles.optionText}>Celsius</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={() => setTempUnit('F')}>
                        <RadioButton selected={tempUnit === 'F'} />
                        <Text style={styles.optionText}>Fahrenheit</Text>
                    </TouchableOpacity>
                </View>

                {/* News Categories */}
                <Text style={styles.sectionTitle}>News Categories</Text>
                {Object.keys(categories).map(cat => (
                    <TouchableOpacity
                        key={cat}
                        style={styles.option}
                        onPress={() => toggleCategory(cat)}
                    >
                        <CheckBox checked={categories[cat]} />
                        <Text style={styles.optionText}>{cat}</Text>
                    </TouchableOpacity>
                ))}

                {/* Refresh Interval */}
                <Text style={styles.sectionTitle}>Refresh interval (mins)</Text>
                <TextInput
                    style={styles.input}
                    value={refreshInterval}
                    onChangeText={setRefreshInterval}
                    keyboardType="numeric"
                />

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: dw * 0.05,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: dw * 0.07,
        fontWeight: 'bold',
        marginBottom: dh * 0.02
    },
    sectionTitle: {
        fontSize: dw * 0.045,
        fontWeight: '600',
        marginTop: dh * 0.025,
        marginBottom: dh * 0.015
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: dh * 0.015
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: dw * 0.1,
        marginBottom: dh * 0.012
    },
    optionText: {
        fontSize: dw * 0.045,
        marginLeft: dw * 0.025
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: dw * 0.02,
        paddingHorizontal: dw * 0.03,
        paddingVertical: dh * 0.012,
        width: dw * 0.2,
        fontSize: dw * 0.045
    },
    saveButton: {
        backgroundColor: '#007BFF',
        paddingVertical: dh * 0.015,
        borderRadius: dw * 0.025,
        alignItems: 'center',
        marginTop: dh * 0.04
    },
    saveButtonText: {
        color: '#fff',
        fontSize: dw * 0.05,
        fontWeight: '600'
    },
    radioOuter: {
        width: dw * 0.06,
        height: dw * 0.06,
        borderRadius: (dw * 0.06) / 2,
        borderWidth: 2,
        borderColor: '#007BFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioOuterSelected: {
        borderColor: '#007BFF'
    },
    radioInner: {
        width: dw * 0.03,
        height: dw * 0.03,
        borderRadius: (dw * 0.03) / 2,
        backgroundColor: '#007BFF'
    },
    checkbox: {
        width: dw * 0.06,
        height: dw * 0.06,
        borderWidth: 2,
        borderColor: '#007BFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkboxChecked: {
        backgroundColor: '#007BFF'
    },
    checkboxTick: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: dw * 0.04
    }
});

export default SettingsScreen;
