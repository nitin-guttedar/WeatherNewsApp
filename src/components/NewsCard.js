import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { dh, dw } from '../constants/Dimensions';


const NewsCard = ({ image, headline, description, link }) => {
    const openLink = () => {
        if (link) {
            Linking.openURL(link).catch(err => console.error("Failed to open link", err));
        }
    };
    return (
        <View style={styles.card}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.headline}>{headline}</Text>
                <Text style={styles.description} numberOfLines={3}>
                    {description}
                </Text>
                {link && (
                    <TouchableOpacity onPress={openLink}>
                        <Text style={styles.linkText}>Link</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#F2F2F2',
        // width: dw,
        margin: dw / 37,
        padding: 10,
        flexDirection: 'row',
        borderRadius: 7,
        overflow: 'hidden',
        elevation: 2
    },
    description: {
        fontSize: 16,
        fontWeight: '400',
        flexShrink: 1
    },
    image: {

    },
    content: {
    },
    headline: {
        fontSize: 20,
        fontWeight: '500',
        paddingVertical: 10
    },
    linkText: {
        color: '#007BFF',
        marginTop: 5,
        fontSize: 14
    }
});

export default NewsCard;
