import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    ActivityIndicator,
} from 'react-native';
import NewsCard from '../components/NewsCard';
import WeatherCard from '../components/WeatherCard';

const API_KEY = 'pub_47653636dfdf49e78fd75a7b56b46a07';

const HomeScreen = () => {
    const [news, setNews] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const fetchNews = async (pageToken = null) => {
        try {
            if (pageToken) {
                setLoadingMore(true);
            } else {
                setLoading(true);
                setError(null);
            }

            let url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&language=en`;
            if (pageToken) {
                url += `&page=${pageToken}`;
            }

            const response = await fetch(url);
            const result = await response.json();

            if (result && result.results) {
                setNews(prevNews => [...prevNews, ...result.results]);
                setNextPage(result.nextPage);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            setError(
                'Failed to fetch news. Please check your API key or network connection.',
            );
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const renderItem = ({ item }) => <NewsCard newsItem={item} />;

    const handleLoadMore = () => {
        if (nextPage && !loadingMore) {
            fetchNews(nextPage);
        }
    };

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#0000ff" />
                <Text style={styles.footerText}>Loading more...</Text>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <WeatherCard />

            <Text style={styles.headline}>Top Headlines</Text>

            <FlatList
                showsVerticalScrollIndicator={false}
                data={news}
                renderItem={renderItem}
                keyExtractor={item => item.article_id}
                contentContainerStyle={styles.listContent}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 16,
    },
    listContent: {
        paddingTop: 10,
        paddingBottom: 20,
    },
    headline: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a202c',
        marginBottom: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    footerText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#666',
    },
});

export default HomeScreen;
