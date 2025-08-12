import { FlatList, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { dh, dw } from '../constants/Dimensions'
import WeatherCard from '../components/WeatherCard'
import NewsCard from '../components/NewsCard'
import { sunIcon } from '../constants/Images'

const HomeScreen = () => {
    // const [loading, setLoading] = useState(false)
    const [newsData, setNewsData] = useState([])
    const [pageToken, setPageToken] = useState(null);

    // useEffect(() => fetchNews()
    //     , [])

    useEffect(() => {
        fetchNews()
    }, [])

    const fetchWeather = async () => {
        setLoading(true)
        try {
            const API_KEY = ''
            const url = ''
            const response = await fetch(url)
            const result = await response.json()
            console.log('result', result);

        }
        catch (err) {
            console.log('Error fetching weather', err);

        }
        finally {
            setLoading(false)
        }

    }

    const fetchNews = async () => {
        // setLoading(true)
        try {
            const API_KEY = 'pub_47653636dfdf49e78fd75a7b56b46a07';
            const url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&country=in${pageToken ? `&page=${pageToken}` : ''}`;
            const response = await fetch(url)
            const result = await response.json()
            console.log('result', JSON.stringify(result));
            const englishNews = (result.results || []).filter(item => item.language === "english");
            setNewsData(englishNews);


            setPageToken(result.nextPage);
        }
        catch (err) {
            console.log('Error fecthing news', err);
        }

    }
    const renderItem = ({ item }) => {
        if (item.language !== 'english') return null;
        return (
            <View key={item.article_id}>
                <NewsCard
                    image={item.image_url}
                    headline={item.title}
                    description={item.description || "No description available"}
                    link={item.link} />
            </View>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <WeatherCard />
            <Text style={styles.title}>Latest News</Text>
            <FlatList data={newsData} renderItem={renderItem}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.article_id}
                // onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5} />
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "white"
    },
    title: {
        fontSize: 25,
        fontWeight: '500',
        paddingHorizontal: dw / 15,
        paddingVertical: dh / 35,
        justifyContent: 'center',
        // alignSelf: "center"
    },

})