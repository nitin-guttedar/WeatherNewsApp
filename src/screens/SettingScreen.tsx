import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dh, dw } from '../constants/Dimensions';
import { useSelector, useDispatch } from 'react-redux';
import { setUnit } from '../redux/weatherSlice';
import { toggleCategory } from '../redux/newsSlice';
import type { RootState, AppDispatch } from '../redux/store';

const SettingsScreen: React.FC = () => {
    const tempUnit = useSelector((state: RootState) => state.weather.unit);
    const categories = useSelector((state: RootState) => state.news.categories);
    const dispatch = useDispatch<AppDispatch>();

    const handleToggleCategory = (cat: string) => {
        dispatch(toggleCategory(cat));
    };

    const SegmentedControl = () => (
        <View style={styles.segmentedContainer}>
            <TouchableOpacity
                style={[styles.segment, tempUnit === 'C' && styles.activeSegment]}
                onPress={() => dispatch(setUnit('C'))}
            >
                <Text
                    style={[
                        styles.segmentText,
                        tempUnit === 'C' && styles.activeSegmentText,
                    ]}
                >
                    °C
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.segment, tempUnit === 'F' && styles.activeSegment]}
                onPress={() => dispatch(setUnit('F'))}
            >
                <Text
                    style={[
                        styles.segmentText,
                        tempUnit === 'F' && styles.activeSegmentText,
                    ]}
                >
                    °F
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.title}>App Settings</Text>
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Weather Units</Text>
                    <SegmentedControl />
                </View>
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>News Categories</Text>
                    <Text style={styles.sectionSubtitle}>
                        Select topics you want to see
                    </Text>
                    <View style={styles.chipsContainer}>
                        {Object.keys(categories).map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.chip,
                                    categories[cat] ? styles.activeChip : styles.inactiveChip,
                                ]}
                                onPress={() => handleToggleCategory(cat)}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        categories[cat] && styles.activeChipText,
                                    ]}
                                >
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
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
});

export default SettingsScreen;
