import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { dh } from '../constants/Dimensions';

const NewsCard = ({ newsItem }) => {
    return (
        <TouchableOpacity style={styles.card} >
            {newsItem.image_url && (
                <Image source={{ uri: newsItem.image_url }} style={styles.image} />
            )}
            <View style={styles.content}>
                <Text style={styles.title}>{newsItem.title}</Text>
                <Text>{newsItem.description}</Text>
                <Text style={styles.source} onPress={() => Linking.openURL(newsItem.source_url)}>Source: {newsItem.source_id}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: dh / 10,
        backgroundColor: '#e0e0e0',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1a202c',
    },
    source: {
        fontSize: 14,
        color: '#718096',
    },
});

export default NewsCard;
