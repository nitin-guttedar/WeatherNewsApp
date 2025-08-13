import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    ScrollView,
    useWindowDimensions,
    PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { dh, dw } from '../constants/Dimensions';

export default function WeatherCard() {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [currentLocation, setCurrentLocation] = useState('Fetching location...');
    const [currentTime, setCurrentTime] = useState(new Date());
    const { width, height } = useWindowDimensions();

    const getPlaceName = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&format=json`
            );
            const data = await response.json();

            const city =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.suburb ||
                data.address.state_district ||
                data.address.state ||
                "Unknown";

            const country = data.address.country || "Unknown";

            return `${city}, ${country}`;
        } catch (error) {
            console.error("Error fetching location name:", error);
            return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        }
    };


    const getWeatherDescription = (code, currentTemp) => {
        const descriptions = {
            0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
            4: 'Cloudy', 45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle',
            53: 'Moderate drizzle', 55: 'Dense drizzle', 56: 'Light Freezing Drizzle',
            57: 'Dense Freezing Drizzle', 61: 'Slight Rain', 63: 'Moderate Rain',
            65: 'Heavy Rain', 66: 'Light Freezing Rain', 67: 'Heavy Freezing Rain',
            71: 'Slight Snow Fall', 73: 'Moderate Snow Fall', 75: 'Heavy Snow Fall',
            77: 'Snow Grains', 80: 'Rain Showers', 81: 'Heavy Rain Showers',
            82: 'Violent Rain Showers', 85: 'Slight Snow Showers', 86: 'Heavy Snow Showers',
            95: 'Thunderstorm', 96: 'Thunderstorm with Slight Hail', 99: 'Thunderstorm with Heavy Hail',
        };

        if (descriptions[code]) return descriptions[code];

        if (currentTemp !== undefined && currentTemp !== null) {
            if (currentTemp > 35) return 'Very Hot Weather';
            if (currentTemp >= 28) return 'Warm & Pleasant Weather';
            if (currentTemp >= 20) return 'Mild Weather';
            if (currentTemp >= 10) return 'Cool Weather';
            if (currentTemp >= 0) return 'Chilly Weather';
            return 'Freezing Cold';
        }

        return 'Unknown Weather Condition';
    };

    const getDynamicWeatherIcon = (code, currentTemp) => {
        const icons = {
            0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 4: '☁️', 45: '🌫️', 48: '🌫️',
            51: '🌦️', 53: '🌧️', 55: '🌧️', 56: '🌨️', 57: '🌨️', 61: '☔', 63: '🌧️',
            65: '⛈️', 66: '🌧️', 67: '🌧️', 71: '🌨️', 73: '❄️', 75: '🥶', 77: '🌨️',
            80: '🌧️', 81: '⛈️', 82: '⚡', 85: '🌨️', 86: '🌨️', 95: '🌩️', 96: '⛈️', 99: '🌪️',
        };

        if (icons[code]) return icons[code];

        if (currentTemp !== undefined && currentTemp !== null) {
            if (currentTemp > 35) return '🔥';
            if (currentTemp >= 28) return '☀️';
            if (currentTemp >= 20) return '🌡️';
            if (currentTemp >= 10) return '🧥';
            if (currentTemp >= 0) return '❄️';
            return '🧊';
        }

        return '❓';
    };

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    setError('Permission to access location denied');
                    return;
                }

                Geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;

                        // Get location name
                        const placeName = await getPlaceName(latitude, longitude);
                        setCurrentLocation(placeName);

                        // Get weather
                        const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
                        const response = await fetch(API_URL);
                        const data = await response.json();
                        setWeatherData(data);
                    },
                    (error) => {
                        console.error(error);
                        setError('Failed to get location');
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            } catch (err) {
                console.error('Error fetching weather:', err);
                setError('Failed to load weather data. Please try again.');
            }
        };

        fetchWeather();

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

    if (error) {
        return (
            <View style={[styles.cardContainer, styles.errorCard, { width: width * 0.95, height: height * 0.4 }]}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!weatherData) {
        return (
            <View style={[styles.cardContainer, { width: width * 0.95, height: height * 0.4 }]}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Loading weather data...</Text>
            </View>
        );
    }

    const { current_weather, daily, hourly } = weatherData;
    const currentTemp = Math.round(current_weather?.temperature || 0);
    const currentDescription = getWeatherDescription(current_weather?.weather_code, currentTemp);
    const currentIcon = getDynamicWeatherIcon(current_weather?.weather_code, currentTemp);

    const hourlyForecast = [];
    const nowHour = currentTime.getHours();
    let startIndex = 0;

    if (hourly && hourly.time) {
        for (let i = 0; i < hourly.time.length; i++) {
            const date = new Date(hourly.time[i]);
            if (date.getHours() === nowHour && date.getDate() === currentTime.getDate()) {
                startIndex = i;
                break;
            }
        }
    }

    if (hourly && hourly.time && hourly.temperature_2m) {
        for (let i = 0; i < 24; i++) {
            const dataIndex = startIndex + i;
            if (dataIndex < hourly.time.length) {
                const hourlyDate = new Date(hourly.time[dataIndex]);
                const displayHour = hourlyDate.getHours();
                const displayTime = (displayHour % 12 || 12) + (displayHour < 12 ? 'a' : 'p') + 'm';
                hourlyForecast.push({
                    key: hourly.time[dataIndex],
                    displayTime: displayTime,
                    temp: Math.round(hourly.temperature_2m[dataIndex]),
                });
            } else break;
        }
    }

    const nextSixDaysForecast = daily?.time?.slice(1, 7).map((date, index) => ({
        date,
        weatherCode: daily.weather_code[index + 1],
        maxTemp: daily.temperature_2m_max[index + 1],
        minTemp: daily.temperature_2m_min[index + 1],
    })) || [];

    return (
        <View style={[styles.cardContainer, { width: width * 0.95, height: height * 0.4 }]}>
            <View style={styles.headerRow}>
                <Text style={styles.locationText}>{currentLocation}</Text>
                <Text style={styles.timeText}>{formattedTime}</Text>
            </View>

            <View style={styles.currentWeatherSummary}>
                <Text style={styles.currentIconSmall}>{currentIcon}</Text>
                <View style={styles.tempAndDesc}>
                    <Text style={styles.currentTempSmall}>{currentTemp}°C</Text>
                    <Text style={styles.currentDescriptionSmall}>{currentDescription}</Text>
                </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
                {hourlyForecast.map(hourData => (
                    <View key={hourData.key} style={[styles.hourlyItemSmall, { width: width * 0.15 }]}>
                        <Text style={styles.hourlyTimeSmall}>{hourData.displayTime}</Text>
                        <Text style={styles.hourlyTempSmall}>{hourData.temp}°</Text>
                    </View>
                ))}
            </ScrollView>

            <FlatList
                horizontal
                data={nextSixDaysForecast}
                keyExtractor={item => item.date}
                renderItem={({ item }) => (
                    <View style={[styles.dailyItemSmall, { width: width * 0.18 }]}>
                        <Text style={styles.dailyDateSmall}>
                            {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </Text>
                        <Text style={styles.dailyIconSmall}>
                            {getDynamicWeatherIcon(item.weatherCode)}
                        </Text>
                        <Text style={styles.dailyTempRangeSmall}>
                            {Math.round(item.maxTemp)}°/{Math.round(item.minTemp)}°
                        </Text>
                    </View>
                )}
                showsHorizontalScrollIndicator={false}
                style={styles.dailyScroll}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    // Your original styles remain unchanged
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 18,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 7,
        elevation: 5,
        margin: 5,
    },
    errorCard: {
        backgroundColor: '#FFEBEE',
        borderColor: '#EF5350',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: '#B71C1C',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
    },
    timeText: {
        fontSize: 15,
        color: '#666666',
    },
    currentWeatherSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    currentIconSmall: {
        fontSize: 48,
        marginRight: 15,
    },
    tempAndDesc: {
        flexDirection: 'column',
    },
    currentTempSmall: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#333333',
    },
    currentDescriptionSmall: {
        fontSize: 18,
        color: '#666666',
    },
    hourlyScroll: {
        flexGrow: 0,
        height: dh / 10,
        marginBottom: 15,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        paddingTop: 10,
    },
    hourlyItemSmall: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    hourlyTimeSmall: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 6,
    },
    hourlyTempSmall: {
        fontSize: 22,
        fontWeight: '500',
        color: '#333333',
    },
    dailyScroll: {
        flexGrow: 0,
        height: dh / 6,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    dailyItemSmall: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dailyDateSmall: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666666',
    },
    dailyIconSmall: {
        fontSize: 28,
    },
    dailyTempRangeSmall: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '500',
    },
});
