import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    ActivityIndicator,
    ListRenderItem,
} from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import NewsCard, { NewsItem } from '../components/NewsCard';
import WeatherCard from '../components/WeatherCard';

const API_KEY = 'pub_47653636dfdf49e78fd75a7b56b46a07';

const HomeScreen: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedCategories = useSelector(
        (state: RootState) => state.news.categories
    );

    const isInitialMount = useRef(true);

    const getCategoryString = (): string => {
        const activeCategories = Object.keys(selectedCategories).filter(
            (cat) => selectedCategories[cat]
        );
        return activeCategories.length > 0 ? activeCategories.join(',') : 'top';
    };

    const fetchNews = async (categories = 'top', pageToken: string | null = null) => {
        try {
            if (pageToken) {
                setLoadingMore(true);
            } else {
                setLoading(true);
                setError(null);
            }

            let url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&language=en&category=${categories}`;
            if (pageToken) {
                url += `&page=${pageToken}`;
            }

            const response = await fetch(url);
            const result = await response.json();

            if (result && result.results) {
                setNews((prevNews) =>
                    pageToken ? [...prevNews, ...result.results] : result.results
                );
                setNextPage(result.nextPage);
            } else {
                if (!pageToken) {
                    setNews([]);
                }
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            setError(
                'Failed to fetch news. Please check your API key or network connection.'
            );
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            fetchNews();
        } else {
            setNews([]);
            setNextPage(null);
            setLoading(true);
            const categories = getCategoryString();
            fetchNews(categories);
        }
    }, [selectedCategories]);

    const renderItem: ListRenderItem<NewsItem> = ({ item }) => (
        <NewsCard newsItem={item} />
    );

    const handleLoadMore = () => {
        if (nextPage && !loadingMore) {
            const categories = getCategoryString();
            fetchNews(categories, nextPage);
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
                keyExtractor={(item) => item.article_id}
                contentContainerStyle={styles.listContent}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                extraData={selectedCategories}
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
