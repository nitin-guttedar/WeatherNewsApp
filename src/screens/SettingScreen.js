import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dh, dw } from '../constants/Dimensions';

const SettingsScreen = () => {
    const [tempUnit, setTempUnit] = useState('C');
    const [categories, setCategories] = useState({
        Technology: true,
        Sports: true,
        Politics: false,
        Entertainment: true,
        Business: true,
        Health: false
    });

    const toggleCategory = (cat) => {
        setCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const SegmentedControl = () => (
        <View style={styles.segmentedContainer}>
            <TouchableOpacity
                style={[
                    styles.segment,
                    tempUnit === 'C' && styles.activeSegment
                ]}
                onPress={() => setTempUnit('C')}
            >
                <Text style={[
                    styles.segmentText,
                    tempUnit === 'C' && styles.activeSegmentText
                ]}>°C</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.segment,
                    tempUnit === 'F' && styles.activeSegment
                ]}
                onPress={() => setTempUnit('F')}
            >
                <Text style={[
                    styles.segmentText,
                    tempUnit === 'F' && styles.activeSegmentText
                ]}>°F</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={[styles.title]}>App Settings</Text>
                <View style={[styles.sectionCard]}>
                    <Text style={[styles.sectionTitle]}>Weather Units</Text>
                    <SegmentedControl />
                </View>
                <View style={[styles.sectionCard]}>
                    <Text style={[styles.sectionTitle]}>News Categories</Text>
                    <Text style={styles.sectionSubtitle}>Select topics you want to see</Text>

                    <View style={styles.chipsContainer}>
                        {Object.keys(categories).map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.chip,
                                    categories[cat] ? styles.activeChip : styles.inactiveChip
                                ]}
                                onPress={() => toggleCategory(cat)}
                            >
                                <Text style={[
                                    styles.chipText,
                                    categories[cat] && styles.activeChipText
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.saveButton,]}
                    activeOpacity={0.8}
                >
                    <Text style={styles.saveButtonText}>Save Preferences</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
        paddingHorizontal: dw * 0.04,
    },
    scrollContent: {
        paddingBottom: dh * 0.04,
    },
    title: {
        fontSize: dw * 0.08,
        fontWeight: '800',
        marginVertical: dh * 0.04,
        color: '#2D3748',
        letterSpacing: -0.5,
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: dw * 0.05,
        marginBottom: dh * 0.025,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: dw * 0.05,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: dh * 0.01,
    },
    sectionSubtitle: {
        fontSize: dw * 0.038,
        color: '#718096',
        marginBottom: dh * 0.025,
    },
    segmentedContainer: {
        flexDirection: 'row',
        backgroundColor: '#EDF2F7',
        borderRadius: 12,
        padding: 4,
        marginTop: dh * 0.01,
    },
    segment: {
        flex: 1,
        paddingVertical: dh * 0.015,
        borderRadius: 10,
        alignItems: 'center',
    },
    activeSegment: {
        backgroundColor: '#1E88E5',
    },
    segmentText: {
        fontSize: dw * 0.045,
        fontWeight: '600',
        color: '#718096',
    },
    activeSegmentText: {
        color: '#FFFFFF',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: dh * 0.01,
    },
    chip: {
        paddingVertical: dh * 0.012,
        paddingHorizontal: dw * 0.04,
        borderRadius: 20,
        marginRight: dw * 0.03,
        marginBottom: dh * 0.015,
        borderWidth: 1.5,
    },
    activeChip: {
        backgroundColor: '#1E88E5',
        borderColor: '#1E88E5',
    },
    inactiveChip: {
        backgroundColor: 'transparent',
        borderColor: '#CBD5E0',
    },
    chipText: {
        fontSize: dw * 0.04,
        fontWeight: '500',
    },
    activeChipText: {
        color: '#FFFFFF',
    },
    settingLabel: {
        fontSize: dw * 0.045,
        color: '#2D3748',
        fontWeight: '500',
    },
    settingDescription: {
        fontSize: dw * 0.037,
        color: '#A0AEC0',
        marginTop: dh * 0.005,
    },
    saveButton: {
        backgroundColor: '#1E88E5',
        paddingVertical: dh * 0.02,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: dh * 0.01,
        shadowColor: '#1E88E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: dw * 0.048,
        fontWeight: '700',
    },
});

export default SettingsScreen;